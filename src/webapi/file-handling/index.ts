/** @link https://developer.chrome.com/articles/file-handling/ */
export const register = (handler: (files: FileSystemFileHandle[]) => void) => {
  // @ts-ignore
  if ("launchQueue" in window && "files" in LaunchParams.prototype) {
    // @ts-ignore
    launchQueue.setConsumer((launchParams) => {
      // Nothing to do when the queue is empty.
      if (!launchParams.files.length) {
        return;
      }
      // for (const fileHandle of launchParams.files) {
      //   // Handle the file.
      // }
      handler(launchParams.files);
    });
  }
};
