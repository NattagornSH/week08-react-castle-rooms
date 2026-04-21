import SecretRoom from "./09_SecretRoom";
export default function Nook({ question, answer, handleAnswer }) {
  return (
    <div className="flex flex-col justify-center items-center pt-10 bg-purple-800 w-[90%]">
      <h1>Nook</h1>
      {/* {Chamber} */}
   
      <SecretRoom
        question={question}
        answer={answer}
        handleAnswer={handleAnswer}
      />
    </div>
  );
}
