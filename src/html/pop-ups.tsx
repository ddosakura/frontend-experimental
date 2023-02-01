/** @link https://developer.chrome.com/blog/pop-ups-theyre-making-a-resurgence/ */
const PlaygroundExample: React.FC = () => {
  return (
    <div>
      <h1>Pop-ups</h1>
      <div
        popover="true"
        id="my-first-popover"
        className="border border-solid border-blue"
      >
        Popover Content!
      </div>
      <button popovertoggletarget="my-first-popover">Toggle Popover</button>
    </div>
  );
};

export default PlaygroundExample;
