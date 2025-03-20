export const addComma = (price) => {
  let returnString = price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return returnString;
}

export const breakLine = (string) => {
  const lineBrokenText = string?.split('\n').map((line, index) => (
    <span key={index}>
      {line}
      <br />
    </span>
  ));

  return lineBrokenText;
}