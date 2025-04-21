import React from "react";
import { useRouter } from "next/router";

const ForbiddenPage = () => {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <div style={styles.icon}>🚫</div>
      <h1 style={styles.errorCode}>403</h1>
      <h2 style={styles.title}>Access Forbidden</h2>
      <p style={styles.message}>
        You do not have permission to view this page.
      </p>
      <button
        style={styles.button}
        onClick={() => router.push("/")} // Redirect to the home page
      >
        Go Back Home
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center" as const,
    backgroundColor: "#f4f4f4",
    padding: "20px",
  },
  icon: {
    fontSize: "80px",
    color: "#e74c3c",
    marginBottom: "20px",
  },
  errorCode: {
    fontSize: "120px",
    color: "#e74c3c",
    margin: "0",
  },
  title: {
    fontSize: "32px",
    margin: "10px 0",
  },
  message: {
    fontSize: "18px",
    margin: "20px 0",
    color: "#555",
  },
  button: {
    padding: "10px 20px",
    fontSize: "18px",
    color: "#fff",
    backgroundColor: "#3498db",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default ForbiddenPage;
