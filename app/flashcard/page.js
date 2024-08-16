"use client";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
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
} from "@mui/material";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const router = useRouter();

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  const generateQuiz = async () => {
    const flashcardsJson = JSON.stringify(flashcards);
    const systemPrompt = `You are a quiz creator. You take in flashcards, which have a front and back, and create a ${flashcards.length} quiz from them. Each question should cover the concepts from the flashcards but rephrase the wording. Ensure each question has four answer choices, one of which is correct. The questions must be in random order, and each question must be unique. You should return the quiz in the following JSON format: {"quiz":[{"question": "The question","answer_choices": ["Option A", "Option B", "Option C", "Option D"], "correct_answer": "The correct answer"}]}. Do not write a sentence at the beginning of your answer. ONLY return the JSON. Here are the flashcards: ${flashcardsJson}`;
    const key =
      "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";
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct:free",
          messages: [{ role: "user", content: systemPrompt }],
        }),
      }
    );

    const json = await response.json();

    if (response.ok) {
      const quiz = JSON.parse(json.choices[0].message.content);
      console.log(flashcards);
      console.log(quiz.quiz);
      router.push(`/quiz?id=${search}`);
      localStorage.setItem("quiz", JSON.stringify(quiz.quiz));
    }
  };

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;
      const colRef = collection(doc(collection(db, "users"), user.id), search);
      const docs = await getDocs(colRef);
      const flashcards = [];

      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(flashcards);
    }
    getFlashcard();
  }, [user]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!isLoaded) {
    return <></>;
  } else if (!isSignedIn) {
    router.push("/");
  }

  return (
    <Box sx={{ backgroundColor: "black", minHeight: "100vh" }}>
      <Container maxWidth="100vw">
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
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"flex-end"}
        >
          <Typography
            variant="h4"
            marginTop={"60px"}
            paddingTop={"40px"}
            color="white"
          >
            Flashcards for {search}
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={() => generateQuiz()}
          >
            Generate Quiz
          </Button>
        </Box>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardActionArea
                  onClick={() => {
                    handleCardClick(index);
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        perspective: "1000px",
                        "& > div": {
                          transition: "transform 0.6s",
                          transformStyle: "preserve-3d",
                          position: "relative",
                          width: "100%",
                          height: "200px",
                          boxShadow: "0 4x 8px 0 rgba(0,0,0,0.2)",
                          transform: flipped[index]
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                        },
                        "& > div > div": {
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          backfaceVisibility: "hidden",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 2,
                          boxSizing: "border-box",
                        },
                        "& > div > div:nth-of-type(2)": {
                          transform: "rotateY(180deg)",
                        },
                      }}
                    >
                      <div>
                        <div>
                          <Typography variant="h5" component="div">
                            {flashcard.front}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="h5" component="div">
                            {flashcard.back}
                          </Typography>
                        </div>
                      </div>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
