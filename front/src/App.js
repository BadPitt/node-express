import React from 'react';
import logo from './logo.svg';
import './App.css';


class QuestionsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: []
    };
  }

  componentWillMount() {
    fetch('http://localhost:3001/question-all')
      .then(response => response.json())
      .then(questions => this.setState({questions}));
  }

  render() {
    let {questions} = this.state;
    return (
      <ul>
        {questions.map(question => {
          return (
            <li>
              <p>Code: {question.code}</p>
              <p>Theme: {question.theme}</p>
              <p>Question: {question.question}</p>
            </li>
          );
        })}
      </ul>
    );
  }
}

function App() {
  return (
    <div className="App">
      <header>
        <p>
          Questions
        </p>
      </header>
      <QuestionsList/>
    </div>
  );
}

export default App;
