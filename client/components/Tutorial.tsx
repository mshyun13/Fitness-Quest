function Tutorial() {
  return (
    <>
      <h1 className="mb-6 text-5xl font-bold text-green-400">Tutorial</h1>
      <p>Click the challenge to view details of challenge</p>
      <div className="mx-auto my-8 max-w-2xl rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-xl">
        <h2 className="mb-4 border-b-2 border-green-700 pb-2 text-center text-2xl font-bold text-green-400">
          Daily Challenges
        </h2>
        <ul className="space-y-4">
          <li
            className="cursor-pointer rounded border border-gray-600 bg-gray-700 p-4 shadow
                               transition duration-200 hover:bg-gray-600"
          >
            <p className="mb-1 text-xl font-bold text-green-200">
              Pushin Through
            </p>
            <p className="text-lg text-gray-300">STR</p>
            <p className="text-lg text-gray-300">Easy</p>
          </li>
        </ul>
      </div>
    </>
  )
}

export default Tutorial
