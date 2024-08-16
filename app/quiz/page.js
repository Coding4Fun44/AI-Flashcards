"use client";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { db } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  getDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useState, useEffect } from "react";
import { NextResponse } from "next/server";
import { useSearchParams } from "next/navigation";

export default function Quiz() {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [correctAmount, setCorrectAmount] = useState(0);
  const [quiz, setQuiz] = useState([]);
  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    setQuiz(JSON.parse(localStorage.getItem("quiz")));
  }, []);

  const handleAnswerChange = (event, questionIndex) => {
    if (!submitted) {
      const updatedSelectedAnswers = [...selectedAnswers];
      updatedSelectedAnswers[questionIndex] = event.target.value;
      setSelectedAnswers(updatedSelectedAnswers);
    }
  };

  const submitQuiz = () => {
    console.log(selectedAnswers);
    let correctAmount = 0;
    quiz.forEach((object, index) => {
      if (object.correct_answer === selectedAnswers[index]) {
        setCorrectAnswers((prevAnswers) => ({
          ...prevAnswers,
          [index]: 1,
        }));
        correctAmount++;
        console.log("correct");
      } else {
        setCorrectAnswers((prevAnswers) => ({
          ...prevAnswers,
          [index]: 0,
        }));
      }
    });
    setSubmitted(true);
    setCorrectAmount(correctAmount);
  };

  return (
    <Box
      sx={{ backgroundColor: "black", minHeight: "100vh" }}
      alignItems={"center"}
    >
      <Container maxWidth="md">
        <AppBar position="fixed" color="success">
          <Toolbar>
            <Typography
              variant="h6"
              style={{ flexGrow: 1 }}
              fontWeight={"bold"}
            >
              FlashAI
            </Typography>
            <SignedOut>
              <Button color="inherit" href="/sign-in">
                <strong>Login</strong>
              </Button>
              <Button color="inherit" href="/sign-up">
                <strong>Sign Up</strong>
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>
        <Typography
          variant="h4"
          marginTop={"60px"}
          paddingTop={"40px"}
          color="white"
        >
          Quiz for {search} Flashcards
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          marginTop={"60px"}
          paddingTop={"40px"}
          paddingBottom={"20px"}
          backgroundColor={"white"}
        >
          {quiz.map((object, index) => (
            <FormControl
              component="fieldset"
              key={index}
              sx={{
                width: "100%",
                maxWidth: "600px", // Limit the width of each question block
                mb: 4, // Add margin between question blocks
              }}
            >
              <FormLabel component="legend">
                <Typography variant="h5">
                  {index + 1}. {object.question}
                </Typography>
              </FormLabel>
              <RadioGroup
                aria-label="answer"
                name="answer"
                value={selectedAnswers[index] || ""}
                onChange={(event) => handleAnswerChange(event, index)}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor:
                      submitted &&
                      object.correct_answer === object.answer_choices[0]
                        ? "lightgreen"
                        : submitted &&
                          selectedAnswers[index] === object.answer_choices[0] &&
                          selectedAnswers[index] !== object.correct_answer &&
                          "pink",
                    border:
                      submitted &&
                      object.correct_answer === object.answer_choices[0]
                        ? "2px solid green"
                        : submitted &&
                          selectedAnswers[index] === object.answer_choices[0] &&
                          selectedAnswers[index] !== object.correct_answer &&
                          "2px solid red",
                    borderRadius: "4px",
                    padding: "8px",
                    mb: 1, // Margin between options
                  }}
                >
                  <FormControlLabel
                    value={object.answer_choices[0]}
                    control={<Radio />}
                    label={object.answer_choices[0]}
                  />
                  {submitted &&
                  object.correct_answer === object.answer_choices[0] ? (
                    <Typography color="green">Correct Answer</Typography>
                  ) : (
                    submitted &&
                    selectedAnswers[index] === object.answer_choices[0] &&
                    selectedAnswers[index] !== object.correct_answer && (
                      <Typography color="red">Your Answer</Typography>
                    )
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor:
                      submitted &&
                      object.correct_answer === object.answer_choices[1]
                        ? "lightgreen"
                        : submitted &&
                          selectedAnswers[index] === object.answer_choices[1] &&
                          selectedAnswers[index] === object.answer_choices[1] &&
                          "pink",
                    border:
                      submitted &&
                      object.correct_answer === object.answer_choices[1]
                        ? "2px solid green"
                        : submitted &&
                          selectedAnswers[index] === object.answer_choices[1] &&
                          selectedAnswers[index] !== object.correct_answer &&
                          "2px solid red",
                    borderRadius: "4px",
                    padding: "8px",
                    mb: 1, // Margin between options
                  }}
                >
                  <FormControlLabel
                    value={object.answer_choices[1]}
                    control={<Radio />}
                    label={object.answer_choices[1]}
                  />
                  {submitted &&
                  object.correct_answer === object.answer_choices[1] ? (
                    <Typography color="green">Correct Answer</Typography>
                  ) : (
                    submitted &&
                    selectedAnswers[index] === object.answer_choices[1] &&
                    selectedAnswers[index] !== object.correct_answer && (
                      <Typography color="red">Your Answer</Typography>
                    )
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor:
                      submitted &&
                      object.correct_answer === object.answer_choices[2]
                        ? "lightgreen"
                        : submitted &&
                          selectedAnswers[index] === object.answer_choices[2] &&
                          selectedAnswers[index] === object.answer_choices[2] &&
                          "pink",
                    border:
                      submitted &&
                      object.correct_answer === object.answer_choices[2]
                        ? "2px solid green"
                        : submitted &&
                          selectedAnswers[index] === object.answer_choices[2] &&
                          selectedAnswers[index] !== object.correct_answer &&
                          "2px solid red",
                    borderRadius: "4px",
                    padding: "8px",
                    mb: 1, // Margin between options
                  }}
                >
                  <FormControlLabel
                    value={object.answer_choices[2]}
                    control={<Radio />}
                    label={object.answer_choices[2]}
                  />
                  {submitted &&
                  object.correct_answer === object.answer_choices[2] ? (
                    <Typography color="green">Correct Answer</Typography>
                  ) : (
                    submitted &&
                    selectedAnswers[index] === object.answer_choices[2] &&
                    selectedAnswers[index] !== object.correct_answer && (
                      <Typography color="red">Your Answer</Typography>
                    )
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor:
                      submitted &&
                      object.correct_answer === object.answer_choices[3]
                        ? "lightgreen"
                        : submitted &&
                          selectedAnswers[index] === object.answer_choices[3] &&
                          selectedAnswers[index] === object.answer_choices[3] &&
                          "pink",
                    border:
                      submitted &&
                      object.correct_answer === object.answer_choices[3]
                        ? "2px solid green"
                        : submitted &&
                          selectedAnswers[index] === object.answer_choices[3] &&
                          selectedAnswers[index] !== object.correct_answer &&
                          "2px solid red",
                    borderRadius: "4px",
                    padding: "8px",
                    mb: 1, // Margin between options
                  }}
                >
                  <FormControlLabel
                    value={object.answer_choices[3]}
                    control={<Radio />}
                    label={object.answer_choices[3]}
                  />
                  {submitted &&
                  object.correct_answer === object.answer_choices[3] ? (
                    <Typography color="green">Correct Answer</Typography>
                  ) : (
                    submitted &&
                    selectedAnswers[index] === object.answer_choices[3] &&
                    selectedAnswers[index] !== object.correct_answer && (
                      <Typography color="red">Your Answer</Typography>
                    )
                  )}
                </Box>
              </RadioGroup>
            </FormControl>
          ))}
          {!submitted ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => submitQuiz()}
              disabled={
                selectedAnswers.length !== quiz.length ||
                selectedAnswers.includes(undefined) ||
                selectedAnswers.includes("")
              }
            >
              Submit
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              href={`/flashcard?id=${search}`}
            >
              Back to Flashcards
            </Button>
          )}
          {submitted && (
            <Typography>
              Quiz Score: {correctAmount} / {quiz.length}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
}
