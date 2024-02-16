import React from "react";
import Axios from "axios";

function Lekerdezes(props) {
  const [post, setPost] = React.useState(null);
  React.useEffect(() => {
    Axios.get("https://localhost:44339/" + props.url)
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => {
        setPost("Hiba");
      });
  }, []);

  if (!post) return null;

  return (
    <div>
      <table>
        <thead>
          <tr>
            {fejlecElem(post[0])}
          </tr>
        </thead>
        <tbody>
          {post.map((row, i) => (
            <tr key={i}>{cellaElem(row)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function fejlecElem(elem) {
  const tmp = [];
  {Object.keys(elem).map( key => {
    if (typeof elem[key] !== "object") 
      tmp.push(<th key={key}>{key}</th>)
    else 
      tmp.push(fejlecElem(elem[key]));
  })}
  return tmp;
}

function cellaElem(elem) {
  const tmp = [];
  Object.keys(elem).map( key => {
    if (typeof elem[key] !== "object") 
      tmp.push(<td key={key}>{elem[key]}</td>);
    else 
      tmp.push(cellaElem(elem[key]));
  });
  return tmp;
}
export default Lekerdezes;
