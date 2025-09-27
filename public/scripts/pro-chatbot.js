const AWS = require('aws-sdk');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const natural = require('natural');

const mongoURIMyDB = process.env.MONGODB_URI_MYDB;
mongoose.connect(mongoURIMyDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connection Established for WebSocket')).catch(err => console.error('MongoDB Connection Error:', err));

const chatSchema = new mongoose.Schema({
  sessionID: { type: String, required: true, unique: true },
  query: String,
  lang: { type: String, default: 'en' },
  response: String,
  status: { type: String, default: 'processing' },
  timestamp: { type: Date, default: Date.now },
  isVoice: { type: Boolean, default: false },
  connectionId: String
});
const Chat = mongoose.model('Chat', chatSchema);

const contextPath = path.join(__dirname, 'proContext.js');
const rawContext = fs.readFileSync(contextPath, 'utf8').replace(/^module\.exports = `/,'').replace(/`$/,'');
const contextLines = rawContext.split('\n').map(line => line.trim()).filter(line => line);

let contextData = { intro: '', sections: {} };
let currentSection = 'intro';
contextLines.forEach(line => {
  if (line.startsWith('###')) {
    currentSection = line.replace('### ', '').toLowerCase();
    contextData.sections[currentSection] = contextData.sections[currentSection] || [];
    console.log(`Switching to section: ${currentSection}`);
  } else if (line && !line.startsWith('-') && currentSection === 'intro') {
    contextData.intro += line + ' ';
  } else if (line.startsWith('-')) {
    contextData.sections[currentSection] = contextData.sections[currentSection] || [];
    contextData.sections[currentSection].push(line.replace(/^-\s*/, ''));
    console.log(`Added to ${currentSection}: ${line.replace(/^-\s*/, '')}`);
  }
});

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

function extractIntent(query, lang) {
  console.log(`Extracting intent for query: ${query}, lang: ${lang}`);
  const tokens = tokenizer.tokenize(query.toLowerCase());
  const stems = tokens.map(token => stemmer.stem(token));
  const intentMap = {
    en: {
      'who': ['intro'],
      'project': ['projects'],
      'skill': ['skills'],
      'tech': ['technical practices and designs'],
      'achiev': ['achievements']
    },
    hi: {
      'कौन': ['intro'],
      'प्रोजेक्ट': ['projects'],
      'स्किल': ['skills'],
      'तकनीक': ['technical practices and designs'],
      'उपलब्धि': ['achievements']
    }
  };
  const langMap = intentMap[lang] || intentMap.en;
  const intents = stems.reduce((acc, stem) => {
    for (let [key, sections] of Object.entries(langMap)) {
      if (stem.includes(key)) acc.push(...sections);
    }
    return [...new Set(acc)];
  }, []);
  console.log(`Extracted intents: ${intents.join(', ')}`);
  return intents;
}

function generateResponse(query, lang) {
  console.log(`Generating response for query: ${query}, lang: ${lang}`);
  const intents = extractIntent(query, lang);
  let response = '';
  const maxItems = 5; // Limit to top 5 items for brevity

  if (intents.includes('intro')) {
    response = `I am Sanjay Patidar, ${contextData.intro.trim()}. Dive into my projects, skills, or achievements for more details.`;
  } else if (intents.includes('projects')) {
    const projects = (contextData.sections.projects || []).slice(0, maxItems);
    response = 'My key projects include:\n' + projects.join('\n');
    if (contextData.sections.projects.length > maxItems) response += '\n... and more. Ask for details on specific projects.';
  } else if (intents.includes('skills')) {
    const skills = (contextData.sections.skills || []).slice(0, maxItems);
    response = 'My professional skills include:\n' + skills.join('\n');
    if (contextData.sections.skills.length > maxItems) response += '\n... and more.';
  } else if (intents.includes('technical practices and designs')) {
    const tech = (contextData.sections['technical practices and designs'] || []).slice(0, maxItems);
    response = 'My technical expertise includes:\n' + tech.join('\n');
    if (contextData.sections['technical practices and designs'].length > maxItems) response += '\n... and more.';
  } else if (intents.includes('achievements')) {
    const achievements = (contextData.sections.achievements || []).slice(0, maxItems);
    response = 'My notable achievements include:\n' + achievements.join('\n');
    if (contextData.sections.achievements.length > maxItems) response += '\n... and more.';
  } else {
    response = `Your signal was unclear. I am Sanjay Patidar, ${contextData.intro.trim().substring(0, 100)}... Send a query about my projects, skills, or achievements.`;
  }
  console.log(`Generated response: ${response}`);
  return response;
}

exports.handler = async (event, context) => {
  console.log('Lambda Function Invoked', { event, context });
  const { routeKey, connectionId } = event.requestContext;
  const body = event.body;
  console.log(`Processing routeKey: ${routeKey}, connectionId: ${connectionId}, raw body: ${body}`);

  try {
    if (routeKey === '$connect') {
      console.log(`Handling $connect for connectionId: ${connectionId}`);
      await Chat.findOneAndUpdate(
        { sessionID: connectionId },
        { connectionId, status: 'connected' },
        { upsert: true }
      );
      console.log(`$connect updated Chat document for sessionID: ${connectionId}`);
      return { statusCode: 200, body: '' };
    }

    if (routeKey === '$disconnect') {
      console.log(`Handling $disconnect for connectionId: ${connectionId}`);
      await Chat.findOneAndDelete({ connectionId });
      console.log(`$disconnect deleted Chat document for sessionId: ${connectionId}`);
      return { statusCode: 200, body: '' };
    }

    // Create ApiGatewayManagementApi client dynamically for message handling
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`
    });

    if (routeKey === 'query') {
      console.log(`Handling query for connectionId: ${connectionId}, raw body: ${body}`);
      let parsedBody;
      try {
        parsedBody = JSON.parse(body);
        console.log(`Parsed body: ${JSON.stringify(parsedBody, null, 2)}`);
      } catch (parseError) {
        console.error('Failed to parse body:', parseError);
        return { statusCode: 400, body: 'Invalid JSON format' };
      }
      const { text: query, lang = 'en', sessionID } = parsedBody;
      console.log(`Parsed query: ${query}, lang: ${lang}, sessionID: ${sessionID}`);

      if (!query) {
        console.log('No query provided, returning 400');
        return { statusCode: 400, body: 'Missing query' };
      }

      await Chat.findOneAndUpdate(
        { sessionID: connectionId },
        { query, lang, status: 'processing', timestamp: Date.now() }
      );
      console.log(`Updated Chat document with query for sessionID: ${connectionId}`);

      const responseText = generateResponse(query, lang);
      await Chat.findOneAndUpdate({ sessionID: connectionId }, { response: responseText, status: 'ready' });
      console.log(`Updated Chat with response: ${responseText}`);

      const postParams = {
        ConnectionId: connectionId,
        Data: JSON.stringify({ text: responseText, sessionID })
      };
      console.log(`Attempting postToConnection with params: ${JSON.stringify(postParams, null, 2)}`);
      try {
        const result = await apigwManagementApi.postToConnection(postParams).promise();
        console.log(`Successfully sent response to connectionId: ${connectionId}`, result);
      } catch (postError) {
        console.error('postToConnection failed:', postError);
        if (postError.code === 'GoneException') {
          console.log('Connection closed, removing from Chat:', connectionId);
          await Chat.findOneAndDelete({ connectionId });
        }
        return { statusCode: 500, body: 'Failed to send response' };
      }
      return { statusCode: 200, body: '' };
    }

    // Handle $default route for unmatched messages
    if (routeKey === '$default') {
      console.log(`Handling $default for connectionId: ${connectionId}, raw body: ${body}`);
      let parsedBody;
      try {
        parsedBody = JSON.parse(body);
        console.log(`Parsed body in $default: ${JSON.stringify(parsedBody, null, 2)}`);
      } catch (parseError) {
        console.error('Failed to parse body in $default:', parseError);
        return { statusCode: 400, body: 'Invalid JSON in default route' };
      }
      const { text: query, lang = 'en', sessionID } = parsedBody;
      if (query) {
        console.log(`Treating $default as query for connectionId: ${connectionId}`);
        await Chat.findOneAndUpdate(
          { sessionID: connectionId },
          { query, lang, status: 'processing', timestamp: Date.now() }
        );
        const responseText = generateResponse(query, lang);
        await Chat.findOneAndUpdate({ sessionID: connectionId }, { response: responseText, status: 'ready' });

        const postParams = {
          ConnectionId: connectionId,
          Data: JSON.stringify({ text: responseText, sessionID })
        };
        console.log(`Fallback postToConnection params: ${JSON.stringify(postParams, null, 2)}`);
        try {
          const result = await apigwManagementApi.postToConnection(postParams).promise();
          console.log(`Fallback response sent to connectionId: ${connectionId}`, result);
        } catch (postError) {
          console.error('Fallback postToConnection failed:', postError);
          if (postError.code === 'GoneException') {
            console.log('Connection closed, removing from Chat:', connectionId);
            await Chat.findOneAndDelete({ connectionId });
          }
          return { statusCode: 500, body: 'Failed to send fallback response' };
        }
      }
      return { statusCode: 200, body: '' };
    }

    console.log(`Invalid routeKey: ${routeKey}, returning 400`);
    return { statusCode: 400, body: 'Invalid route' };
  } catch (error) {
    console.error('WebSocket Error Details:', error, 'Context:', context.awsRequestId);
    return { statusCode: 500, body: 'Internal error' };
  }
};
