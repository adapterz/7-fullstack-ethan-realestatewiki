regex = /(?:https?:\/\/)?(?:www\.)?youtu.be\/([a-zA-Z0-9-]{11})/;
const url = "https://www.youtu.be/-ZClicWm0zM";
const result = url.match(regex);
cosole.log(result[0]);
