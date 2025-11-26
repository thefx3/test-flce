// src/pages/TestInterface.jsx
import { useState } from "react";
import IntroTest from "./IntroTest";
import StartTestForm from "./StartTestForm";
import TestQuestions from "./TestQuestions";
import TestEnd from "./TestEnd";

export default function TestInterface() {
  const [step, setStep] = useState("intro"); // "intro" | "start" | "questions" | "end"
  const [testId, setTestId] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);

  function handleIntroNext() {
    setStep("start");
  }

  //Create the test and the session Token
  function handleStartSuccess({ testId, sessionToken }) {
    setTestId(testId);
    setSessionToken(sessionToken);
    setStep("questions");
  }

  function handleTestSubmitted() {
    setStep("end");
  }

  return (
    <div className="french-test">

      {step === "intro" && (
        <IntroTest onSuccess={handleIntroNext} />
      )}

      {step === "start" && (
        <StartTestForm onSuccess={handleStartSuccess} />
      )}


      {step === "questions" && testId && sessionToken && (
        <TestQuestions
          testId={testId}
          sessionToken={sessionToken}
          onSubmitted={handleTestSubmitted}
        />
      )}

      {step === "end" && <TestEnd />}
    </div>
  );
}
