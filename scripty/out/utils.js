"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
exports.retrieveCommentedFiles = retrieveCommentedFiles;
exports.uploadMetrics = uploadMetrics;
exports.uploadSummary = uploadSummary;
async function generate(fileContent, prompt) {
    const response = await fetch("https://proxy.tune.app/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "sk-tune-Sjre53YgSZ3Oufkv5skl1Z2kyN6NjSLfkhG"
        },
        body: JSON.stringify({
            temperature: 0.3,
            messages: [
                {
                    "role": "system",
                    "content": prompt
                },
                {
                    "role": "user",
                    "content": `Analyze the following code: ${fileContent}`
                }
            ],
            model: "benxu/benxu-gpt-4o-mini",
            stream: false,
            "frequency_penalty": 0.2,
        })
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Assuming the desired content is under a key like 'choices' or similar
    return data.choices[0].message.content;
}
async function retrieveCommentedFiles() {
    // const response = await fetch (/** stuff */);
    // const files = await response.json();
    // return files;
}
async function uploadMetrics(evals) {
    const now = new Date();
    const upsert_score = {
        timestamp: now.toISOString(),
        readability: evals[0],
        syntax: evals[1],
        practice: evals[2]
    };
    fetch('http://127.0.0.1:8000/upload_scores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(upsert_score)
    })
        .then(response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
    });
}
async function uploadSummary(upsert_data) {
    fetch('http://127.0.0.1:8000/upload_summary', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(upsert_data)
    })
        .then(response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
    });
    fetch('http://127.0.0.1:8000/upload_embedding', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(upsert_data)
    })
        .then(response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
    });
}
//# sourceMappingURL=utils.js.map