"use client";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  getDoc,
  setDoc,
  collection,
  writeBatch,
  deleteDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  Container,
  Card,
  AppBar,
  Toolbar,
  Button,
  Box,
  TextField,
} from "@mui/material";

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [filter, setFilter] = useState("");
  const router = useRouter();

  async function getFlashcards() {
    if (!user) return;
    const docRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      setFlashcards(collections);
      console.log(collections);
    } else {
      await setDoc(docRef, { flashcards: [] });
    }
  }

  useEffect(() => {
    getFlashcards();
  }, [user]);

  if (!isLoaded) {
    return <></>;
  } else if (!isSignedIn) {
    router.push("/");
  }

  const deleteFlashcards = async (id) => {
    const colRef = collection(doc(collection(db, "users"), user.id), id);
    const colDocs = await getDocs(colRef);

    const batch = writeBatch(db);

    colDocs.forEach((flashcard) => {
      const docRef = doc(colRef, flashcard.id);
      batch.delete(docRef);
    });

    await batch.commit();

    const docRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const flashcardsCollection = docSnap.data().flashcards || [];
      const updatedCollections = flashcardsCollection.filter(
        (item) => item.name !== id
      );
      await setDoc(docRef, { flashcards: updatedCollections }, { merge: true });
    }

    await getFlashcards();
  };

  const filteredCards = flashcards.filter(
    (item) =>
      item.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.subject.toLowerCase().includes(filter.toLowerCase())
  );

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

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
          marginTop={"60px"}
          paddingTop={"40px"}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box display={"flex"} gap={"30px"} alignItems={"center"}>
            <Typography variant="h4" color="white">
              My Flashcards
            </Typography>
            <TextField
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Search Flashcards"
              rows={4}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white", // White outline
                  },
                  "&:hover fieldset": {
                    borderColor: "gray", // Gray outline on hover
                  },
                },
                "& .MuiOutlinedInput-input": {
                  color: "white", // White input text
                },
                "& .MuiInputLabel-root": {
                  color: "white", // White label text
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "white", // White label text when focused
                },
              }}
            ></TextField>
          </Box>
          <Button variant="contained" color="success" href="/generate">
            Create New
          </Button>
        </Box>
        <Grid
          container
          spacing={3}
          sx={{
            mt: 4,
          }}
        >
          {filteredCards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardActionArea
                  onClick={() => {
                    handleCardClick(flashcard.name);
                  }}
                >
                  <CardContent>
                    <Box display={"flex"} justifyContent={"space-between"}>
                      <Typography variant="h6">{flashcard.name}</Typography>
                      <Box display={"flex"} gap={"20px"} alignItems={"center"}>
                        <Typography
                          sx={{
                            color: "blue",
                            border: "2px solid blue",
                            backgroundColor: "lightblue",
                            borderRadius: 1,
                            p: 0.5,
                          }}
                        >
                          {flashcard.subject}
                        </Typography>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteFlashcards(flashcard.name);
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
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
