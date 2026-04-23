import Nook from "./08_Nook"

export default function Gallery() {
  return (
    <div className="flex flex-col justify-center items-center pt-10 bg-indigo-500 w-[90%]">
      <h1>Gallery</h1>
      {/* Nook */}
      <Nook  />
    </div>
  );
}