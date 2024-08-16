"use client";
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
} from "@mui/material";

import Head from "next/head";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const handleSubmit = async (amount) => {
    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      body: JSON.stringify({ amount }),
      headers: {
        "Content-Type": "application/json",
        origin: "https://localhost:3000",
      },
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.log(error.message);
    }
  };

  if (isSignedIn) {
    router.push("/flashcards");
  }

  return (
    <SignedOut>
      <Box sx={{ backgroundColor: "black", minHeight: "100vh" }}>
        <Container maxWidth="100%">
          <Head>
            <title>FlashAI</title>
            <meta
              name="description"
              content="Create flashcard from your text"
            ></meta>
          </Head>

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

          <Box sx={{ textAlign: "center", my: 8 }}>
            <Typography
              variant="h2"
              paddingTop={"20px"}
              color="white"
              gutterBottom
            >
              Welcome to FlashAI
            </Typography>
            <Typography variant="h5" color="white" gutterBottom>
              The easiest way to make flashcards from your test
            </Typography>
            <Button
              variant="contained"
              color="success"
              sx={{
                mt: 2,
                width: "200px",
                height: "70px",
                fontSize: "23px",
                fontWeight: "bold",
              }}
              href="/sign-in"
            >
              Get Started
            </Button>
          </Box>
          <Box sx={{ my: 6 }}>
            <Typography variant="h4" marginBottom={5} color="white">
              Features
            </Typography>
            <Grid container spacing={2} justifyContent={"center"}>
              <Grid
                item
                xs={12}
                md={4}
                marginRight={1}
                sx={{
                  p: 1,
                  border: "1px solid",
                  borderColor: "white",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  color="white"
                  textAlign={"center"}
                >
                  Easy Text Input
                </Typography>
                <Typography color="white" textAlign={"center"}>
                  Simply input your text and let our software do the rest.
                  Creating flashcards has never been easier.
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                p={1}
                sx={{
                  border: "1px solid",
                  borderColor: "white",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  color="white"
                  textAlign={"center"}
                >
                  Smart Flashcards
                </Typography>
                <Typography color="white" textAlign={"center"}>
                  Our AI intelligently breaks down your text into concise
                  flashcards, perfect for studying.
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent={"center"}>
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  marginTop: 3,
                  p: 1,
                  border: "1px solid",
                  borderColor: "white",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  color="white"
                  textAlign={"center"}
                >
                  Accessible Anywhere
                </Typography>
                <Typography color="white" textAlign={"center"}>
                  Access your flashcards from any device at any time. Study on
                  the go with ease.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </SignedOut>
  );
}
/*
<Box sx={{ my: 6, textAlign: "center" }}>
  <Typography variant="h4" gutterBottom>
    Pricing
  </Typography>
  <Grid container spacing={4}>
    <Grid item xs={12} md={6}>
      <Box
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: "grey.300",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Basic
        </Typography>
        <Typography variant="h6" gutterBottom>
          $5 / month
        </Typography>
        <Typography>
          Access to basic flashcard features and limited storage.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => {
            handleSubmit(5);
          }}
        >
          Choose Basic
        </Button>
      </Box>
    </Grid>
    <Grid item xs={12} md={6}>
      <Box
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: "grey.300",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Pro
        </Typography>
        <Typography variant="h6" gutterBottom>
          $10 / month
        </Typography>
        <Typography>Unlimited flashcards and storage</Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => {
            handleSubmit(10);
          }}
        >
          Choose Pro
        </Button>
      </Box>
    </Grid>
  </Grid>
</Box>;
*/
