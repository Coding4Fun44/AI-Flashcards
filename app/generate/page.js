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
} from "@mui/material";
import { useState } from "react";
import { NextResponse } from "next/server";

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [subject, setSubject] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    const systemPrompt = `You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly ${amount} flashcards. Both front and back should be one sentence long. The front should have a vocabulary word or question, and the back should have some sort of definition. The front and back of each flashcard must be unique. You should return in the following JSON format: {"flashcards":[{"front": "Front of the card","back": "Back of the card"}]}. Do not write a sentence at the beginning of your answer. ONLY return the JSON. This is the text: ${text}`;
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
      const flashcards = JSON.parse(json.choices[0].message.content);
      setFlashcards(flashcards.flashcards);
      console.log(flashcards.flashcards);
    }
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!name) {
      alert("Please enter a name");
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert("Flashcard collection with the same name already exists.");
        return;
      } else {
        collections.push({ name, subject });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name, subject }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push("/flashcards");
  };

  return (
    <Box sx={{ backgroundColor: "black", minHeight: "100vh" }}>
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

        <Box
          sx={{
            mt: 8,
            pt: 2,
            mb: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" color="white">
            Generate Flashcards
          </Typography>
          <Paper sx={{ p: 4, width: "100%", marginTop: 2 }}>
            <TextField
              value={text}
              onChange={(e) => setText(e.target.value)}
              label="Descriptive Text"
              fullWidth
              rows={4}
              variant="outlined"
              sx={{ mb: 2 }}
            ></TextField>
            <TextField
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              label="Amount"
              fullWidth
              rows={4}
              variant="outlined"
              sx={{ mb: 2 }}
            ></TextField>
            <TextField
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              label="Subject"
              fullWidth
              rows={4}
              variant="outlined"
              sx={{ mb: 2 }}
            ></TextField>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              fullWidth
            >
              Generate
            </Button>
          </Paper>
        </Box>

        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" color={"white"}>
              Flashcards Preview
            </Typography>
            <Grid container spacing={3} marginTop="10px">
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
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpen}
              >
                Save
              </Button>
            </Box>
          </Box>
        )}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Save Flashcards</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a name for your flashcards collection
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Collection Name"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
            ></TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={saveFlashcards}>Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
