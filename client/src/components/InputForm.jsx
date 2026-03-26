import { useActionState, useState } from "react";
const InputForm = ({ onGenerate }) => {
    const [url, setUrl] = useState("");
    const [goal, setGoal] = useState("");
    const [company, setCompany] = useState("");
    const [tone, setTone] = useState("Professional");

    const handleSubmit = (e) => {
        e.preventDefault();
        onGenerate({ url, goal, company, tone });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                className="input"
                placeholder="Website / LinkedIn URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />

            <input
                className="input"
                placeholder="Goal (internship, sales...)"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
            />

            <input
                className="input"
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
            />

            <select
                className="input"
                onChange={(e) => setTone(e.target.value)}
            >
                <option>Professional</option>
                <option>Casual</option>
                <option>Persuasive</option>
            </select>

            <button className="button" type="submit">
                Generate Email
            </button>
        </form>
    );
};
export default InputForm;