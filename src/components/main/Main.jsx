import { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../../assets/assets";
import "./main.css";
import { Context } from "../../context/Context";

const Main = () => {
	const {
		onSent,
		recentPrompt,
		showResults,
		loading,
		resultData,
		setInput,
		input,
	} = useContext(Context);

	const [allResults, setAllResults] = useState([]);
	const chatResultsRef = useRef(null);

    const handleCardClick = (promptText) => {
		setInput(promptText);
		sendPrompt();
	};

	const sendPrompt = () => {
		if (input.trim()) {
			onSent();
			setTimeout(() => {
				if (recentPrompt && resultData) {
					setAllResults(prev => [...prev, { 
						prompt: recentPrompt, 
						result: resultData 
					}]);
				}
			}, 100);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			sendPrompt();
		}
	};

	// UseEffect to scroll to bottom when results change
	useEffect(() => {
		if (chatResultsRef.current) {
			chatResultsRef.current.scrollTop = chatResultsRef.current.scrollHeight;
		}
	}, [allResults, showResults, resultData]);
	

	return (
		<div className="main">
			<div className="nav">
				<p>AskQTR</p>
				<img src={assets.user} alt="" />
			</div>
			<div className="main-container">
				{/* Wrap results in a scrollable div */}
				<div 
					ref={chatResultsRef} 
					className="chat-results-container"
					style={{
						maxHeight: 'calc(100vh - 300px)', // Adjust height as needed
						overflowY: 'auto'
					}}
				>
					{/* Render all previous results */}
					{allResults.map((item, index) => (
						<div key={index} className="result">
							<div className="result-title">
								<img src={assets.user} alt="" />
								<p>{item.prompt}</p>
							</div>
							<div className="result-data">
								<img src={assets.gemini_icon} alt="" />
								<p dangerouslySetInnerHTML={{ __html: item.result }}></p>
							</div>
						</div>
					))}

					{/* Current result/loading state */}
					{showResults && (
						<div className="result">
							<div className="result-title">
								<img src={assets.user} alt="" />
								<p>{recentPrompt}</p>
							</div>
							<div className="result-data">
								<img src={assets.gemini_icon} alt="" />
								{loading ? (
									<div className="loader">
										<hr />
										<hr />
										<hr />
									</div>
								) : (
									<p dangerouslySetInnerHTML={{ __html: resultData }}></p>
								)}
							</div>
						</div>
					)}

					{!showResults && (
						<>
							<div className="greet">
								<p>
									<span>Hello  </span>
								</p>
								<p>How can I help you PLAN today?</p>
							</div>
							<div className="cards">
								<div
									className="card"
									onClick={() =>
										handleCardClick("What task do I have on my schedule today?")
									}
								>
									<p>What task do I have on my schedule today?</p>
									<img src={assets.compass_icon} alt="" />
								</div>
								<div
									className="card"
									onClick={() =>
										handleCardClick(
											"Help me plan my work"
										)
									}
								>
									<p>Help me plan my work</p>
									<img src={assets.message_icon} alt="" />
								</div>
								<div
									className="card"
									onClick={() =>
										handleCardClick("What meetings do I have today?")
									}
								>
									<p>What meetings do I have today?</p>
									<img src={assets.bulb_icon} alt="" />
								</div>
								<div
									className="card"
									onClick={() => {
										handleCardClick(
											"Summerize all undone tasks"
										);
									}}
								>
									<p>Summerize all undone tasks</p>
									<img src={assets.code_icon} alt="" />
								</div>
							</div>
						</>
					)}
				</div>

				<div className="main-bottom">
					<div className="search-box">
						<input
							onChange={(e) => {
								setInput(e.target.value);
							}}
							onKeyDown={handleKeyDown}
							value={input}
							type="text"
							placeholder="Enter the Prompt Here"
						/>
						<div>
							<img src={assets.gallery_icon} alt="" />
							<img src={assets.mic_icon} alt="" />
							<img
								src={assets.send_icon}
								alt=""
								onClick={sendPrompt}
							/>
						</div>
					</div>
					<div className="bottom-info">
						<p>
							AskQTR may display inaccurate info, including about people, so
							double-check its responses.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Main;