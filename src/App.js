import React from "react";
import "./App.css";
import io from "socket.io-client";
import { Modal, InputGroup, FormControl, Button } from "react-bootstrap";

const connOpt = {
  transports: ["websocket"],
};
let socket = io("https://striveschool.herokuapp.com/", connOpt);

function App() {
  const [username, setUsername] = React.useState(null);
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [showModal, setShowModal] = React.useState(true);

  React.useEffect(() => {
    console.log(messages);
    socket.on("bmsg", (msg) => setMessages((messages) => messages.concat(msg)));
  }, [socket]);

  const handleMessage = (e) => {
    setMessage(e.currentTarget.value);
  };

  const sendMessage = (e) => {
    e.preventDefault();

    console.log(message);
    if (message !== "") {
      socket.emit("bmsg", {
        user: username,
        message: message,
      });
      setMessage("");
    }
  };

  const toggleModal = () => {
    if (username !== null) setShowModal(!showModal);
  };

  return (
    <>
      <div className="App">
        <ul id="messages" style={{ listStyle: "none", padding: "0 2rem" }}>
          {messages.map((msg, i) => (
            <li key={i}>
              <strong>{msg.user}</strong> {msg.message}
            </li>
          ))}
        </ul>
        <form
          id="chat"
          onSubmit={sendMessage}
          style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            display: "flex",
            padding: "1rem",
            background: "black",
          }}
        >
          <input
            autoComplete="off"
            value={message}
            onChange={handleMessage}
            style={{ flex: "1 0 auto", outline: 0 }}
            className="rounded-0 border-0"
          />
          <Button type="send" className="rounded-0">
            Send
          </Button>
        </form>
      </div>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showModal}
        onHide={toggleModal}
      >
        <Modal.Header>
          <Modal.Title>Set username</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="my-2">
            <FormControl
              placeholder="Enter a Username"
              onChange={(e) => setUsername(e.currentTarget.value)}
            ></FormControl>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" className="w-100" onClick={toggleModal}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
