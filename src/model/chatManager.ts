import { reactive } from "vue";
import type { Conversation, FollowUp } from "./model";

const state = reactive({
    chatHistory: [] as Conversation[]
});
const contextLength = 5;

export function getChatHistory() : Conversation[] {
    return state.chatHistory;
}

export function addChatToHistory(con : Conversation) : void {
    state.chatHistory.push(con);
}

export function getCurrentFollowUp() : FollowUp {
    if (getChatHistory().length > 0) {
        const currentConv = getChatHistory()[getChatHistory().length - 1];
        return currentConv!.followUp ?? {};
    }
    return {};
}

export function addFollowUp(followUp: FollowUp) : void {
    if (getChatHistory().length > 0) {
        const currentConv : Conversation = getChatHistory().pop()!;
        if (currentConv)
            currentConv.followUp = followUp;
        
        addChatToHistory(currentConv);
    }
}

export function getChatContext() {
    console.log('getChatContext');
    if (state.chatHistory.length <= contextLength) {
        console.log('short');
        return getContext(state.chatHistory);
    }
    else {
        console.log('long');
        let i = (state.chatHistory.length - contextLength);
        return getContext(state.chatHistory.slice(i));
    }
}

function getContext(relevantHistory : Conversation[]) : string {
    console.log('getContext, history length: ', relevantHistory.length);
    let context = '\n<Chat history>\n';

    for (let h of relevantHistory) {
        context += appendChatContext(h);
    }

    context += '</Chat history>\n';

    return context;
}

function appendChatContext(item : Conversation) {
    let histItem = ''; 
    histItem += 'user: ';
    histItem += item.question + '\n';

    for (let r of item.responses) {
        histItem += 'assistant: ';
        histItem += r.answer + '\n';
    }

    return histItem;
}

