import { useState } from "react";
import { useNavigate } from "react-router-dom";

import StartTestForm from "./StartTestForm";
import TestQuestions from "./TestQuestions";
import TestVideo from "./TestVideo";
import TestEnd from "./TestEnd";

export default function TestInterface() {
  const navigate = useNavigate();

  const [step, setStep] = useState("start");
  const [testId, setTestId] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);


  function handleStartSuccess({ testId, sessionToken }) {
    setTestId(testId);
    setSessionToken(sessionToken);
    setStep("intro"); //Go to QCM
  }

  function handleNext() {
    setStep("questions"); //Go to VIDEO
  }

  function handleTestSubmitted() {
    setStep("end"); //Go to OPEN QUESTIONS
    setTimeout(() => navigate("/"), 2500);
  }

  return (
    <div className="french-test">

      {step === "intro" && (
        <StartTestForm onSuccess={handleStartSuccess} />
      )}

      {step === "questions" && (
        <TestQuestions
          testId={testId}
          sessionToken={sessionToken}
          onSubmitted={handleNext}
        />
      )}

      {step === "part2" && (
        <TestVideo
          testId={testId}
          sessionToken={sessionToken}
          onSubmitted={handleTestSubmitted}
        />
      )}

      {step === "end" && <TestEnd />}
    </div>
  );
}
