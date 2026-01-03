import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js'; 

dotenv.config({ path: './.env' });

const pythonQuestions = [
    { text: "What is the output of: print(10 // 3)?", answer: "3" },
    { text: "Which keyword is used to create a function?", answer: "def" },
    { text: "How do you start a single-line comment in Python?", answer: "#" },
    { text: "What is the result of 2 ** 3?", answer: "8" },
    { text: "Which data type is immutable: List or Tuple?", answer: "tuple" },
    { text: "What is the correct file extension for Python files?", answer: ".py" },
    { text: "How do you create a variable 'x' with value 5?", answer: "x = 5" },
    { text: "What is the output of: print('Python'[0])?", answer: "P" },
    { text: "Which method removes whitespace from both ends of a string?", answer: "strip()" },
    { text: "Which keyword is used for 'else if' in Python?", answer: "elif" },
    { text: "What function is used to get the number of items in a list?", answer: "len()" },
    { text: "How do you add an element to the end of a list?", answer: "append()" },
    { text: "What is the boolean result of 10 > 9?", answer: "true" },
    { text: "Which operator is used to check if two values are NOT equal?", answer: "!=" },
    { text: "What is the result of bool(0)?", answer: "false" },
    { text: "Which keyword is used to import a module?", answer: "import" },
    { text: "What is the output of: print(type(10))?", answer: "int" },
    { text: "Which loop is used to iterate over a sequence?", answer: "for" },
    { text: "What is the result of 10 % 3?", answer: "1" },
    { text: "How do you write 'Hello' in the console?", answer: "print('Hello')" }
];

const feedData = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in .env file");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("📡 Connected to MongoDB...");

        await Question.deleteMany();
        console.log("🧹 Old questions cleared.");

        await Question.insertMany(pythonQuestions);
        console.log(`✅ Successfully fed ${pythonQuestions.length} Python questions!`);

        mongoose.connection.close();
        process.exit();
    } catch (err) {
        console.error("❌ Error feeding data:", err);
        process.exit(1);
    }
};

feedData();