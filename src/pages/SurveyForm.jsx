import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const SurveyForm = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ rule: "May Select", answer: "" }]);
  const [questionsList, setQuestionsList] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleOptionsChange = (index, field, e) => {
    const updatedOptions = [...options];
    updatedOptions[index][field] = e.target.value;
    setOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, { rule: "May Select", answer: "" }]);
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };

  const handleSaveQuestion = () => {
    if (editIndex !== -1) {
      const updatedQuestionsList = [...questionsList];
      updatedQuestionsList[editIndex] = { question, options };
      setQuestionsList(updatedQuestionsList);
      setEditIndex(-1);
    } else {
      const newQuestion = { question, options };
      setQuestionsList([...questionsList, newQuestion]);
    }
    setQuestion("");
    setOptions([{ rule: "May Select", answer: "" }]);
  };

  const handleEditQuestion = (index) => {
    const editedQuestion = questionsList[index];
    setQuestion(editedQuestion.question);
    setOptions(editedQuestion.options);
    setEditIndex(index);
  };

  const handleEditQuestionSubmit = (index) => {
    const updatedQuestion = {
      question: question,
      options: options,
    };
    handleEditQuestion(index, updatedQuestion);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestionsList = [...questionsList];
    updatedQuestionsList.splice(index, 1);
    setQuestionsList(updatedQuestionsList);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const updatedQuestionsList = [...questionsList];
    const [removed] = updatedQuestionsList.splice(result.source.index, 1);
    updatedQuestionsList.splice(result.destination.index, 0, removed);
    setQuestionsList(updatedQuestionsList);
  };

  const grid = 8;

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 250,
  });

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "lightgrey",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  return (
    <div>
      <h1>Survey Questions</h1>
      <form>
        <TextField
          label="Question"
          value={question}
          onChange={handleQuestionChange}
          fullWidth
        />
        {options.map((option, index) => (
          <Grid container spacing={2} key={index}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Options Rule</InputLabel>
                <Select
                  value={option.rule}
                  onChange={(e) => handleOptionsChange(index, "rule", e)}
                >
                  <MenuItem value="May Select">May Select</MenuItem>
                  <MenuItem value="Must Select">Must Select</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Options Answer"
                value={option.answer}
                onChange={(e) => handleOptionsChange(index, "answer", e)}
                fullWidth
              />
            </Grid>
            {index > 0 && (
              <Grid item xs={2}>
                <IconButton onClick={() => handleRemoveOption(index)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>
        ))}
        <Button onClick={handleAddOption}>Add Option</Button>
        <Button onClick={handleSaveQuestion}>Save Question</Button>
      </form>
      <h2>Submitted Questions:</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questionsList">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {questionsList.map((question, index) => (
                <Draggable
                  key={index}
                  draggableId={`question-${index}`}
                  index={index}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <h3>{question.question}</h3>
                      {question.options.map((option, index) => (
                        <div key={index}>
                          <p>
                            <strong>Rule: </strong>
                            {option.rule}
                          </p>
                          <p>
                            <strong>Answer: </strong>
                            {option.answer}
                          </p>
                        </div>
                      ))}
                      <IconButton onClick={() => handleDeleteQuestion(index)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleEditQuestionSubmit(index)}
                      >
                        <EditIcon />
                      </IconButton>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default SurveyForm;
