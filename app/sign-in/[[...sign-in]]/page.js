import React from "react";
import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import { SignIn, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
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
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          marginTop={"60px"}
          paddingTop={"20px"}
        >
          <Typography variant="h4" color="white" paddingBottom={"10px"}>
            Sign In
          </Typography>
          <SignIn />
        </Box>
      </Container>
    </Box>
  );
}
