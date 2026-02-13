export function openDrivePicker({ accessToken, onPick }) {
  window.gapi.load("picker", () => {
    const picker = new window.google.picker.PickerBuilder()
      .addView(window.google.picker.ViewId.DOCS)
      .addView(window.google.picker.ViewId.FOLDERS)
      .setOAuthToken(accessToken)
      .setDeveloperKey("AIzaSyCfHjwXydxQByf08OfxgRe771c-zksuHgE")
      .setCallback(onPick)
      .build();

    picker.setVisible(true);
  });
}
