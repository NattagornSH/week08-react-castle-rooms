import Rooms from "./04_Rooms";

export default function Chamber({ question, answer, handleAnswer }) {
  return (
    <div className="flex flex-col justify-center items-center pt-10 bg-yellow-500 w-[90%]">
      <h1>Chamber</h1>
      {/* {Chamber} */}
  
      <Rooms question={question} answer={answer} handleAnswer={handleAnswer} />
    </div>
  );
}
