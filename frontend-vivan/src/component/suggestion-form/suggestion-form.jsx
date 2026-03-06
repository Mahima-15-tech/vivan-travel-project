import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { MdClose } from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";
import { post as apipost } from "../../API/apiHelper";
import { submitfeedback } from "../../API/endpoints";
import Progress from "../../component/Loading";
import { ToastContainer, toast } from "react-toastify";

const SuggestionForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [name, setNme] = useState("");
  const [designation, setDesignation] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const maxWords = 500;

  const handleOpen = () => {
    setIsOpen(true);
    setSuggestion("");
    setDesignation("");
    setNme("");
    setWordCount(0);
    setisLoading(false);
  };
  const handleClose = () => setIsOpen(false);

  const handleChange = (e) => {
    const input = e.target.value;
    const words = input.trim().split(/\s+/).filter(Boolean); // Count valid words
    if (words.length <= maxWords) {
      setSuggestion(input);
      setWordCount(words.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);
    //
    const response = await apipost(
      submitfeedback,
      { name: name, designation: designation, message: suggestion },
      true
    );

    const data = await response.json();
    if (data.status) {
      setIsOpen(false);
      setSuggestion("");
      setDesignation("");
      setNme("");
      setWordCount(0);
      setisLoading(false);

      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 185,
          right: 20,
          zIndex: 1000,
          backgroundColor: "#ff5722",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
          cursor: "pointer",
        }}
        onClick={handleOpen}
      >
        <VscFeedback size={28} color="#fff" />
      </div>

      <Modal open={isOpen} onClose={handleClose} closeAfterTransition>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <IconButton
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(0, 0, 0, 0.04)",
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.1)" },
            }}
            onClick={handleClose}
          >
            <MdClose size={24} />
          </IconButton>

          <Typography variant="h6" component="h2" gutterBottom>
            Share Your Feedback
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Your Name"
              variant="outlined"
              value={name}
              onChange={(e) => setNme(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Your Designation"
              variant="outlined"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Your Suggestion"
              variant="outlined"
              multiline
              rows={4}
              margin="normal"
              value={suggestion}
              onChange={handleChange}
              helperText={`${wordCount}/${maxWords} words`}
              required
            />

            {isLoading ? (
              <Progress />
            ) : (
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  bgcolor: "#ffa85d",
                  "&:hover": { bgcolor: "#ffa85d" },
                }}
              >
                Submit
              </Button>
            )}
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default SuggestionForm;
