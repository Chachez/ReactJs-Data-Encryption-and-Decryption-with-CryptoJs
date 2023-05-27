import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import {
  TextField,
  Button,
  Paper,
  Typography,
  DialogActions,
  Grid,
} from "@mui/material";
import CryptoJS from "crypto-js";
import { styled } from "@mui/system";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";

const RootComponent = styled("div")(({ theme }) => ({
  maxWidth: "100%",
  maxHeight: "100%",
  margin: "0 auto",
  padding: theme.spacing(3, 3, 6, 3),
  overflow: "auto",
}));

const PaperComponent = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(3),
  [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    padding: theme.spacing(3),
  },
  borderRadius: "10px",
  boxShadow: "0 10px 30px 0 rgba(172, 168, 168, 0.43)",
}));

const DataPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(3),
  [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    padding: theme.spacing(3),
  },
  borderRadius: "10px",
  boxShadow: "0 1px 5px 0 rgba(172, 168, 168, 0.43)",
}));

// Custom JSON array validation function
const validateJSONArray = (value) => {
  try {
    const parsedArray = JSON.parse(value);
    return Array.isArray(parsedArray);
  } catch (error) {
    return false;
  }
};

// Schema validation using Yup
const validationSchema = yup.object().shape({
  jsonData: yup
    .string()
    .required("JSON data is required")
    .test("jsonArray", "Invalid JSON array format", (value) =>
      validateJSONArray(value)
    ),
});

const App = () => {
  const [encryptedData, setEncryptedData] = useState("");
  const [decryptedData, setDecryptedData] = useState("");

  const { REACT_APP_SECRET_KEY } = process.env;

  const handleSubmit = (values) => {
    const { jsonData } = values;

    // Encrypt JSON data
    const encrypted = CryptoJS.AES.encrypt(
      jsonData,
      REACT_APP_SECRET_KEY
    ).toString();
    setEncryptedData(encrypted);

    // Decrypt JSON data
    const decrypted = CryptoJS.AES.decrypt(
      encrypted,
      REACT_APP_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);
    setDecryptedData(decrypted);
  };

  return (
    <RootComponent>
      <PaperComponent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
          Encrypt or Decrypt your Array of JSON Data
        </Typography>
        <Formik
          initialValues={{ jsonData: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, resetForm }) => (
            <Form>
              <Field
                as={TextField}
                name="jsonData"
                label="Enter your Array of JSON Data"
                multiline
                rows={5}
                fullWidth
                helperText={<ErrorMessage name="jsonData" />}
                error={Boolean(touched.jsonData && errors.jsonData)}
              />

              <DialogActions>
                <Button
                  type="submit"
                  variant="outlined"
                  color="primary"
                  endIcon={<EnhancedEncryptionIcon />}
                >
                  Encrypt & Decrypt
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>

        <DataPaper>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Encrypted Data
          </Typography>

          <Grid
            container
            spacing={3}
            sx={{ maxHeight: "16.5vh", overflow: "auto", marginTop: "0.1rem" }}
          >
            <Grid item sm={12} md={12} lg={12}>
              <Typography variant="subtitle2" gutterBottom>
                {encryptedData}
              </Typography>
            </Grid>
          </Grid>
        </DataPaper>

        <DataPaper>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Decrypted Data
          </Typography>
          <Grid
            container
            spacing={3}
            sx={{ maxHeight: "16.5vh", overflow: "auto", marginTop: "0.1rem" }}
          >
            <Grid item sm={12} md={12} lg={12}>
              <Typography variant="subtitle2" gutterBottom>
                {decryptedData}
              </Typography>
            </Grid>
          </Grid>
        </DataPaper>
      </PaperComponent>
    </RootComponent>
  );
};

export default App;
