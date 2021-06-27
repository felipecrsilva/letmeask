import { useHistory, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { Switch } from '../components/Switch';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { useTheme } from '../hooks/useTheme';
import { database } from '../services/firebase';

import '../styles/pages/room.scss';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const { signOut } = useAuth()
    const history = useHistory()
    const params = useParams<RoomParams>()
    const roomId = params.id;

    const { title, questions } = useRoom(roomId)
    const { theme } = useTheme()

    async function handleEndRoom() {
        await database.ref(`/rooms/${roomId}`).update({
            endedAt: new Date()
        })

        history.push('/')
    }

    async function handleDeleteQuestion(questionId : string) {
        if (window.confirm('Tem certeza que você deseja deseja excluir essa pergunta?')) {
            await database.ref(`/rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    async function handleCheckQuestionAsAnswered(questionId : string) {
        await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        })
    }

    async function handleHighlightQuestion(questionId : string) {
        await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        })
    }
    
    return (
        <div id="page-room" className={theme}>
            <header>
                <div className="content">
                    <div className="logo">
                        <img src={logoImg} alt="Letmeask"/>
                        <Switch />
                    </div>
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                    <button onClick={signOut}>
                        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><path d="M17,8l-1.41,1.41L17.17,11H9v2h8.17l-1.58,1.58L17,16l4-4L17,8z M5,5h7V3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h7v-2H5V5z"/></g></svg>
                    </button>
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question 
                              key={question.id}
                              content={question.content}
                              author={question.author}
                              isAnswered={question.isAnswered}
                              isHighlighted={question.isHighlighted}
                            >
                                { !question.isAnswered && (
                                    <>
                                        <button
                                          type="button"
                                          onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                        >
                                            <img src={checkImg} alt="Marcar pergunta como respondida"/>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleHighlightQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="Dar destaque à pergunta"/>
                                        </button>
                                    </>
                                ) }
                                <button
                                  type="button"
                                  onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta"/>
                                </button>
                            </Question>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}