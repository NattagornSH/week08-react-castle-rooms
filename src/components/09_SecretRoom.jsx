export default function SecretRoom({ question, answer, handleAnswer }) {
  return (
    <div className="flex flex-col justify-center items-center pt-10 bg-slate-800 w-[90%]">
      <h1>Secret Room</h1>
      <p>
        Message from outside
        <span>{question ? question : "Waiting for your message..."}</span>
      </p>
      <textarea
        value={answer}
        onChange={handleAnswer}
        className="bg-white text-black rounded px-2 py-1 "
        placeholder="Type your message here..."
      />
      <p></p>
      {/* {Chamber} */}
    </div>
  );
}
