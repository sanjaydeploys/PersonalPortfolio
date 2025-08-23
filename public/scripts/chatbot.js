(function() {
  // Initialize messages from localStorage or set default
  window.messages = JSON.parse(localStorage.getItem('portfolio-chat')) || [
    {
      sender: 'ai',
      text: 'Hi! I\'m Sanjay Patidar\'s portfolio chatbot. Ask about his projects, skills, or life stories, like "Who is Sanjay Patidar?" or "Tell me a funny story from Sanjay’s school days!"',
      id: 'welcome',
      timestamp: new Date().toISOString(),
      category: 'welcome',
      reactions: [],
      isPinned: false
    }
  ];

  // Validate and reset messages if corrupted
  try {
    if (!Array.isArray(window.messages)) {
      console.warn('Invalid localStorage data, resetting messages');
      window.messages = [{
        sender: 'ai',
        text: 'Hi! I\'m Sanjay Patidar\'s portfolio chatbot. Ask about his projects, skills, or life stories, like "Who is Sanjay Patidar?" or "Tell me a funny story from Sanjay’s school days!"',
        id: 'welcome',
        timestamp: new Date().toISOString(),
        category: 'welcome',
        reactions: [],
        isPinned: false
      }];
      localStorage.setItem('portfolio-chat', JSON.stringify(window.messages));
    }
  } catch (e) {
    console.error('Error parsing localStorage:', e);
    window.messages = [{
      sender: 'ai',
      text: 'Hi! I\'m Sanjay Patidar\'s portfolio chatbot. Ask about his projects, skills, or life stories, like "Who is Sanjay Patidar?" or "Tell me a funny story from Sanjay’s school days!"',
      id: 'welcome',
      timestamp: new Date().toISOString(),
      category: 'welcome',
      reactions: [],
      isPinned: false
    }];
    localStorage.setItem('portfolio-chat', JSON.stringify(window.messages));
  }

  let isLoading = false;
  let isDarkMode = false;
  let isHistoryCollapsed = false;
  let fontSize = parseInt(localStorage.getItem('chat-font-size')) || 14;
  let editingMessageId = null;
  let editedText = '';
  let isRecording = false;
  let isAutoReplyEnabled = true;
  let isAutoSpeakEnabled = true;
  let showTimestamps = true;
  let searchQuery = '';
  let selectedCategory = '';
  let currentLang = localStorage.getItem('chat-lang') || 'en';
  let pendingMessage = null; // Store message waiting for tone selection
  let pendingMessageId = null; // Store ID of pending message
  let interactionAnalytics = { questionsAsked: 0, speechUsed: 0, categories: {}, reactionsUsed: 0 };
  const suggestedPrompts = {
    en: [
      'Who is Sanjay Patidar?',
      'What are Sanjay’s projects?',
      'Tell me about LIC Neemuch.',
      'What is Zedemy LMS?',
      'How does ConnectNow work?',
      'What is EventEase?',
      'What frontend skills does Sanjay have?',
      'What backend skills does Sanjay specialize in?',
      'What are Sanjay’s cloud computing skills?',
      'How does Sanjay optimize apps for SEO?',
      'What are Sanjay’s key achievements?',
      'How has Sanjay improved page load times?',
      'How can I contact Sanjay for collaboration?',
      'How did Sanjay handle a tight deadline?',
      'What challenges did Sanjay face in ConnectNow?',
      'How did Sanjay overcome academic setbacks?',
      'How does Sanjay learn new technologies?',
      'How does Sanjay handle team conflicts?',
      'What’s Sanjay’s experience with CI/CD?',
      'How does Sanjay ensure app security?',
      'Tell me a funny story from Sanjay’s school days!',
      'What was Sanjay’s Navodaya experience like?',
      'What’s Sanjay’s favorite hobby?',
      'Share a memorable moment from Sanjay’s life.'
    ],
    hi: [
      'संजय पाटीदार कौन हैं?',
      'संजय के प्रोजेक्ट्स क्या हैं?',
      'LIC नीमच के बारे में बताएं।',
      'Zedemy LMS क्या है?',
      'ConnectNow कैसे काम करता है?',
      'EventEase क्या है?',
      'संजय के फ्रंटएंड स्किल्स क्या हैं?',
      'संजय किन बैकएंड स्किल्स में विशेषज्ञ हैं?',
      'संजय की क्लाउड कंप्यूटिंग स्किल्स क्या हैं?',
      'संजय ऐप्स को SEO के लिए कैसे ऑप्टिमाइज करते हैं?',
      'संजय की प्रमुख उपलब्धियां क्या हैं?',
      'संजय ने पेज लोड टाइम्स कैसे सुधारे?',
      'सहयोग के लिए संजय से कैसे संपर्क कर सकता हूं?',
      'संजय ने टाइट डेडलाइन को कैसे हैंडल किया?',
      'ConnectNow में संजय को क्या चुनौतियां आईं?',
      'संजय ने अकादमिक असफलताओं को कैसे पार किया?',
      'संजय नई तकनीकों को कैसे सीखते हैं?',
      'संजय टीम संघर्षों को कैसे हैंडल करते हैं?',
      'संजय का CI/CD में क्या अनुभव है?',
      'संजय ऐप सिक्योरिटी कैसे सुनिश्चित करते हैं?',
      'संजय के स्कूल के दिनों की एक मज़ेदार कहानी बताएं!',
      'संजय का नवोदय अनुभव कैसा था?',
      'संजय का पसंदीदा शौक क्या है?',
      'संजय के जीवन का एक यादगार पल साझा करें।'
    ]
  };
  let filteredSuggestions = suggestedPrompts[currentLang];
  const emojiOptions = ['👍', '😄', '⚽', '🍲', '👏'];
  const primaryApiKey = 'AIzaSyDt6yiWJ1_W4QtDf5mxr4wb-c3aH7TT_3I';
  const fallbackApiKey = 'AIzaSyDrREs858u-6yXsv7LFNQhyN4UH81EyXIs';
const context = `
Sanjay Patidar is a Serverless Full-Stack SaaS Engineer recognized by Amazon and Microsoft hiring managers for building production-grade platforms and tech content. He has delivered 12+ real-world applications across insurance, education, communication, and event management, with global reach in 127 countries.

### School Life
Sanjay’s school journey began at Jagrati Madhyamic Vidhyalaya, where he consistently scored above 90% through 5th grade, topping his class with 93% in 5th and impressing a classmate who later joined him at Jawahar Navodaya Vidyalaya, Rampura (Neemuch). His seven years at Navodaya (6th to 12th grade) were a vibrant mix of academics, pranks, and leadership in the scenic Aravali Sadan hostel, nestled near the Aravali hills and Chambal River.

#### Navodaya Journey
- **Admission and Aravali Sadan**: At age 10, Sanjay joined Navodaya, a government boarding school with strict rules. On admission day, like a desi Harry Potter, he insisted on joining Aravali Sadan (despite being assigned Udaigiri) after hearing its reputation, proudly choosing his “house” for the next seven years.
- **Daily Life**: Life at Navodaya was a disciplined adventure. Sanjay woke up at 6 AM for chores (washing clothes, bathing daily—though he, a “smart gora ladka,” questioned the need for daily baths!). Morning exercises preceded a 7 AM breakfast siren, triggering a sprint for his favorite pohe-jalebi, earning him the nickname “pohe paglu.”
- **School and Sports**: School ran from 8 AM to 2 PM with prayers, studies, and masti. Lunch (featuring Sanjay’s beloved ful gobhi, bhindi, and sev ki sabji) was a highlight, followed by rest and more classes until 5 PM. The golden hour was 5–6 PM sports time, where Sanjay’s passion for football shone. Despite strict rules banning outside items, he sneaked in a football, only for it to be confiscated by the PT teacher—leading to dramatic tears until it was returned.
- **Hostel Antics**: Evenings included 6 PM prayers, snacks (samosa or sevfal), and evening classes until 8 PM, followed by dinner while watching TV. Sanjay’s mischievous side peaked in 11th grade, when he and friends climbed hostel windows at 3 AM and cooked gulab jamun using a heater coil on a brick. Caught by the house master, Sanjay escaped punishment with his charm—the master even ate two jamuns, jokingly asking for better ones next time!
- **Leadership Roles**: By 8th grade, Sanjay’s good conduct and athletic build earned him the role of Junior Aravali Sadan Captain. In 11th grade, he became Senior Captain, TV In-Charge, and Sports In-Charge, holding keys to the TV and gym. As Student on Duty, he managed mess supplies, sneaked extra pohe-jalebi, and enjoyed TV all day. His football obsession sculpted a six-pack, which he proudly showed off to impress classmates.
- **Memorable Moments**: Diwali’s month-long holidays brought joy, with late-night packing for home. In 11th grade, Sanjay shed his innocence for full-on Navodaya masti, pulling off legendary pranks. By 12th grade, CBSE boards demanded focus, but football remained his constant. After seven years, Sanjay graduated, leaving behind a legacy of leadership and laughter.

#### Transition to Career
Post-Navodaya, Sanjay’s father sent him to Kota, Rajasthan, for IIT preparation, shifting his focus from childhood pranks to a career-driven path, though his love for football and pohe endures.

### Projects
- **Digitizing a 60-Year-Old Insurance Office**:
  - **Problem**: A government insurance office in Neemuch had no digital presence, relying on pamphlets and WhatsApp forwards, with no system for online leads and poor search visibility.
  - **Solution**: Sanjay built a serverless platform with React, Tailwind CSS, Vite, React Helmet (frontend); AWS Lambda, API Gateway, MongoDB Atlas (backend); AWS S3, CloudFront, SSL via ACM, Cloudflare DNS (infrastructure); and CloudWatch Logs (monitoring).
  - **Outcomes**: Achieved 100/100 Lighthouse score, ranked pages within days via SEO (React Helmet, pre-rendering), and increased inquiry submissions by 3x in two months.
  - **Proof**: Paid freelance project (₹50,000) with signed Letter of Engagement and SRS document.
- **Zedemy LMS**: A serverless learning management system with markdown-to-HTML rendering, author dashboards, and UUID-based certificates. Built with React, Tailwind, Node.js, Express, DynamoDB, and Google OAuth2. Achieved 100/100 Lighthouse score, indexed 12+ blogs in 72 hours, and supports scalable CMS for bootcamps.
- **ConnectNow**: A peer-to-peer audio-video platform using raw WebRTC, Express, and Socket.IO for custom signaling. Features dynamic room creation, STUN/TURN fallback, and zero third-party SDKs. Handled 20+ test sessions with secure, ephemeral rooms.
- **EventEase**: A no-code event publishing SaaS with Google Calendar API integration, React + FullCalendar UI, and MongoDB Atlas backend. Indexed event pages in 48 hours, achieved 98+ Lighthouse score, and empowered 10+ admins to publish events without training.

### Skills
- **Frontend**: Proficient in React, Next.js, TypeScript, Tailwind CSS; builds responsive, accessible UIs with lazy loading and code splitting.
- **Backend**: Expertise in Node.js, Express, MongoDB, serverless (AWS Lambda, API Gateway, DynamoDB); designs scalable REST and GraphQL APIs.
- **Cloud**: AWS Certified, specializing in serverless (Lambda, Step Functions, SQS), CloudFormation, CDK, and CI/CD with GitHub Actions.
- **SEO**: Advanced skills in JSON-LD schemas, SSR, structured data, mobile-first optimization; improved load times by 40% and search rankings.
- **Other**: Experienced with WebRTC, Socket.io, Google Calendar API, Jest, GitHub, and accessibility (semantic HTML, alt tags).

### Achievements
- Delivered 12+ applications across multiple domains.
- Achieved 500K+ impressions and 20K+ clicks on EduXcel.
- Reduced Zedemy costs by 40% and insurance office load times by 70%.
- Recognized by Amazon and Microsoft hiring managers for platforms and content.
- Led Aravali Sadan as captain, managing hostel duties and sports.

### Challenges Overcome
- Overcame academic detention by proving project impact.
- Resolved EventEase design disputes with data-driven A/B testing.
- Met insurance office’s 3-week deadline with CI/CD and milestones.
- Self-taught Google Calendar API and WebRTC under pressure.
- Balanced hostel pranks (e.g., midnight cooking) with leadership roles.

### Contact
- Email: sanjay.awsindia@gmail.com
- LinkedIn: linkedin.com/in/sanjay-patidar
`;
  const hindiContext = `
संजय पाटीदार एक सर्वरलेस फुल-स्टैक SaaS इंजीनियर हैं, जिन्हें अमेज़न और माइक्रोसॉफ्ट के हायरिंग मैनेजरों द्वारा प्रोडक्शन-ग्रेड प्लेटफॉर्म और टेक कंटेंट बनाने के लिए मान्यता प्राप्त है। उन्होंने बीमा, शिक्षा, संचार और इवेंट मैनेजमेंट में 12+ रियल-वर्ल्ड एप्लिकेशन डिलीवर किए हैं, जो 127 देशों में ग्लोबल पहुंच रखते हैं।

### स्कूल जीवन
संजय ने जागृति माध्यमिक विद्यालय में 5वीं कक्षा तक पढ़ाई की, जहां उन्होंने हर कक्षा में 90% से अधिक अंक प्राप्त किए और 5वीं में 93% लाकर स्कूल टॉपर बने, जिससे एक सहपाठी प्रभावित हुई, जो बाद में उनके साथ जवाहर नवोदय विद्यालय, रामपुरा (नीमच) में शामिल हुई। नवोदय में सात साल (6वीं से 12वीं) अरावली सदन हॉस्टल में रहे, जो अरावली पहाड़ियों और चंबल नदी के पास एक खूबसूरत जगह थी।

#### नवोदय यात्रा
- **दाखिला और अरावली सदन**: 10 साल की उम्र में संजय ने नवोदय में दाखिला लिया, एक सख्त नियमों वाला सरकारी बोर्डिंग स्कूल। दाखिले के दिन, देसी हैरी पॉटर की तरह, उन्होंने अरावली सदन की तारीफ सुनकर उसी में शामिल होने की जिद की (हालांकि उन्हें उदयगिरी में चुना गया था), और अगले सात साल तक गर्व से अपने “हाउस” का हिस्सा रहे।
- **दैनिक जीवन**: नवोदय में जीवन अनुशासित मगर रोमांचक था। सुबह 6 बजे उठकर संजय कपड़े धोते, नहाते (हालांकि “स्मार्ट गोरा लड़का” होने के नाते वे रोज नहाने की जरूरत पर सवाल उठाते!)। सुबह की कसरत के बाद 7 बजे नाश्ते का सायरन बजते ही वे अपने पसंदीदा पोहा-जलेबी के लिए दौड़ पड़ते, जिसके चलते उन्हें “पोहा पगलु” का खिताब मिला।
- **स्कूल और खेल**: स्कूल सुबह 8 बजे प्रार्थना से शुरू होकर दोपहर 2 बजे तक चलता, जिसमें पढ़ाई और मस्ती दोनों शामिल थे। दोपहर के भोजन में फूल गोभी, भिंडी और सेव की सब्जी संजय को बहुत पसंद थी। 1 घंटे आराम के बाद दोबारा स्कूल जाना पड़ता, जब नींद सबसे ज्यादा सताती। शाम 5 बजे छुट्टी के बाद 1 घंटे का खेल का समय सबसे शानदार था। फुटबॉल के दीवाने संजय ने पापा से जिद करके फुटबॉल खरीदा, लेकिन स्कूल के सख्त नियमों के कारण इसे छिपाकर रखना पड़ा। एक बार पीटी टीचर ने इसे जब्त कर लिया, जिससे संजय इतना रोए जैसे उनका पहला प्यार चला गया हो, पर बाद में फुटबॉल वापस मिल गया। 6वीं, 7वीं और 8वीं में उन्होंने जमकर फुटबॉल खेला।
- **हॉस्टल की शरारतें**: शाम 6 बजे प्रार्थना, फिर नाश्ता (समोसा या सेवफल), और 8 बजे तक शाम की कक्षाएं। रात का खाना टीवी देखते हुए खाया जाता। 11वीं कक्षा में संजय की शरारतें चरम पर थीं, जैसे रात 3 बजे खिड़कियों से चढ़ना और ईंट पर हीटर कॉइल लगाकर गुलाब जामुन बनाना। एक बार बिना दरवाजा बंद किए गुलाब जामुन बनाते पकड़े गए, लेकिन हाउस मास्टर ने सिर्फ दो जामुन खाए और मजाक में कहा, “अगली बार अच्छे बनाना!” संजय का अच्छा स्वभाव उन्हें बचा ले गया।
- **नेतृत्व भूमिकाएं**: 8वीं तक अपने अच्छे व्यवहार और मजबूत कद-काठी के कारण संजय को जूनियर अरावली सादन कैप्टन बनाया गया। 11वीं में सीनियर कैप्टन, टीवी इंचार्ज और स्पोर्ट्स इंचार्ज बने, जिनके पास टीवी और जिम की चाबियां थीं। स्टूडेंट ऑन ड्यूटी के रूप में, वे मेस की सप्लाई का हिसाब रखते, चुपके से पोहा-जलेबी बचाते, और दिनभर टीवी देखते। फुटबॉल की लत ने उनकी सिक्स-पैक बॉडी बनाई, जिसे वे जानबूझकर दिखाते ताकि सहपाठी प्रभावित हों।
- **यादगार पल**: दीवाली की एक महीने की छुट्टियों में रात को घर जाने की खुशी में सामान पैक करना यादगार था। 11वीं में संजय ने मासूमियत छोड़कर नवोदय का पूरा लुत्फ उठाया, ऐतिहासिक शरारतें कीं। 12वीं में CBSE बोर्ड के लिए पढ़ाई पर फोकस किया, पर फुटबॉल कभी नहीं छोड़ा। सात साल बाद, संजय ने नवोदय से विदाई ली, नेतृत्व और हंसी की विरासत छोड़कर।

#### कैरियर की शुरुआत
नवोदय के बाद, संजय के पिता ने उन्हें IIT की तैयारी के लिए कोटा, राजस्थान भेजा, जिसने उनके बचपन की मस्ती को करियर की दौड़ में बदल दिया, हालांकि फुटबॉल और पोहे का प्यार आज भी बरकरार है।

### प्रोजेक्ट्स
- **60 साल पुराने बीमा कार्यालय का डिजिटलाइजेशन**:
  - **समस्या**: नीमच जिले का एक सरकारी बीमा कार्यालय पूरी तरह एनालॉग था, जिसमें कोई वेबसाइट, ऑनलाइन लीड सिस्टम, या सर्च दृश्यता नहीं थी।
  - **समाधान**: संजय ने फ्रंटएंड (React, Tailwind CSS, Vite, React Helmet), बैकएंड (AWS Lambda, API Gateway, MongoDB Atlas), इंफ्रास्ट्रक्चर (AWS S3, CloudFront, SSL via ACM, Cloudflare DNS), और मॉनिटरिंग (CloudWatch Logs) के साथ एक सर्वरलेस प्लेटफॉर्म बनाया।
  - **परिणाम**: 100/100 लाइटहाउस स्कोर, SEO (React Helmet, प्री-रेंडरिंग) से कुछ दिनों में रैंकिंग, और दो महीनों में पूछताछ 3 गुना बढ़ी।
  - **प्रमाण**: ₹50,000 की पेड फ्रीलांस परियोजना, जिसमें साइन किया गया लेटर ऑफ एंगेजमेंट और SRS दस्तावेज।
- **Zedemy LMS**: मार्कडाउन-टू-HTML रेंडरिंग, ऑथर डैशबोर्ड, और UUID-बेस्ड सर्टिफिकेट्स के साथ सर्वरलेस लर्निंग मैनेजमेंट सिस्टम। React, Tailwind, Node.js, Express, DynamoDB, और Google OAuth2 से बना। 100/100 लाइटहाउस स्कोर, 72 घंटों में 12+ ब्लॉग इंडेक्स, और बूटकैंप्स के लिए स्केलेबल CMS।
- **ConnectNow**: रॉ WebRTC, Express, और Socket.IO के साथ पीयर-टू-पीयर ऑडियो-वीडियो प्लेटफॉर्म। डायनामिक रूम क्रिएशन, STUN/TURN फॉलबैक, और जीरो थर्ड-पार्टी SDKs। 20+ टेस्ट सेशन हैंडल किए।
- **EventEase**: Google Calendar API इंटीग्रेशन, React + FullCalendar UI, और MongoDB Atlas बैकएंड के साथ नो-कोड इवेंट पब्लिशिंग SaaS। 48 घंटों में इवेंट पेज इंडेक्स, 98+ लाइटहाउस स्कोर, और 10+ एडमिन्स को बिना ट्रेनिंग के इवेंट पब्लिश करने में सक्षम बनाया।

### स्किल्स
- **फ्रंटएंड**: React, Next.js, TypeScript, Tailwind CSS में कुशल; लेजी लोडिंग और कोड स्प्लिटिंग के साथ रिस्पॉन्सिव, एक्सेसिबल UI बनाते हैं।
- **बैकएंड**: Node.js, Express, MongoDB, सर्वरलेस (AWS Lambda, API Gateway, DynamoDB) में विशेषज्ञता; स्केलेबल REST और GraphQL API डिजाइन करते हैं।
- **क्लाउड**: AWS प्रमाणित, सर्वरलेस (Lambda, Step Functions, SQS), CloudFormation, CDK, और GitHub Actions के साथ CI/CD में विशेषज्ञ।
- **SEO**: JSON-LD स्कीमास, SSR, स्ट्रक्चर्ड डेटा, मोबाइल-फर्स्ट ऑप्टिमाइजेशन में उन्नत स्किल्स; लोड टाइम्स को 40% बेहतर बनाया और सर्च रैंकिंग्स सुधारी।
- **अन्य**: WebRTC, Socket.io, Google Calendar API, Jest, GitHub, और एक्सेसिबिलिटी (सिमेंटिक HTML, alt टैग्स) में अनुभवी।

### उपलब्धियां
- कई डोमेन में 12+ एप्लिकेशन डिलीवर किए।
- EduXcel पर 500K+ इंप्रेशन्स और 20K+ क्लिक्स प्राप्त किए।
- Zedemy की लागतों को 40% कम किया और बीमा कार्यालय के लोड टाइम्स को 70%।
- अमेज़न और माइक्रोसॉफ्ट के हायरिंग मैनेजरों द्वारा प्लेटफॉर्म और कंटेंट के लिए मान्यता प्राप्त।
- अरावली सादन के कैप्टन के रूप में हॉस्टल और स्पोर्ट्स का नेतृत्व किया।

### चुनौतियां पार कीं
- प्रोजेक्ट प्रभाव साबित करके अकादमिक डिटेंशन से पार पाया।
- डेटा-ड्रिवन A/B टेस्टिंग से EventEase डिजाइन विवादों को हल किया।
- CI/CD और माइलस्टोन्स से बीमा कार्यालय की 3-वीक डेडलाइन पूरी की।
- दबाव में Google Calendar API और WebRTC सेल्फ-टॉट।
- रात के खाना पकाने जैसे हॉस्टल शरारतों को नेतृत्व के साथ संतुलित किया।

### संपर्क
- ईमेल: sanjay.awsindia@gmail.com
- LinkedIn: linkedin.com/in/sanjay-patidar
`;

  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition ? new (window.SpeechRecognition || window.webkitSpeechRecognition)() : null;

  function getContext() {
    return currentLang === 'hi' ? hindiContext : context;
  }

  function showTonePicker(message, messageId) {
    const tonePromptText = currentLang === 'hi' ? 'आप कौन सा लहजा सुनना चाहेंगे?' : 'Which tone would you like to hear?';
    const tonePromptId = Date.now();
    
    // Store pending message
    pendingMessage = message;
    pendingMessageId = messageId;
    
    // Add tone prompt message to chat
    window.messages.push({
      sender: 'ai',
      text: tonePromptText,
      id: tonePromptId,
      timestamp: new Date().toISOString(),
      category: 'tone_prompt',
      reactions: [],
      isPinned: false
    });
    
    // Render messages to show the prompt
    renderMessages();
    
    // Speak the tone prompt
    if (typeof window.speakMessage === 'function') {
      window.speakMessage(tonePromptId, tonePromptText, currentLang);
    }
  }

  async function processMessageWithTone(message, messageId, tone) {
    isLoading = true;
    interactionAnalytics.questionsAsked++;
    const category = categorizeMessage(message);
    interactionAnalytics.categories[category] = (interactionAnalytics.categories[category] || 0) + 1;

    let aiResponse;
    let projectDetails = null;
    let quickReplies = [];
    const toneInstruction = tone === 'funny'
      ? 'Respond in a funny, engaging, and heartfelt tone suitable for an Indian audience. Use culturally relevant, non-technical humor (e.g., references to school life, hostel pranks, or food like pohe-jalebi). Avoid tech jargon (e.g., serverless, API) and movie references (e.g., Bollywood, SRK). Keep it family-friendly and relatable.'
      : 'Respond in a professional, concise, and technical tone suitable for a tech audience. Include brief personal context (e.g., school discipline) where relevant, but focus on career achievements and skills.';
    const fullPrompt = `You are an AI assistant for Sanjay Patidar's portfolio. ${toneInstruction} Use the following context to answer questions about Sanjay's work, skills, or personal life. For general questions outside this context, provide accurate and relevant answers based on general knowledge. Context: ${getContext()}\n\nUser question: ${message}\n\nProvide a clear, well-educated response in ${currentLang === 'hi' ? 'Hindi' : 'English'}.`;

    async function tryApiRequest(apiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
        });
        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
      } catch (error) {
        console.error('API error with key:', apiKey, error.message);
        return null;
      }
    }

    try {
      // Try primary API key first
      aiResponse = await tryApiRequest(primaryApiKey);
      if (!aiResponse) {
        console.warn('Primary API failed, trying fallback API key');
        aiResponse = await tryApiRequest(fallbackApiKey);
      }
      if (!aiResponse || aiResponse.includes('I don\'t have enough information')) {
        const searchResults = await performWebSearch(message);
        aiResponse = searchResults || (currentLang === 'hi' ? 'क्षमा करें, मुझे विशिष्ट जानकारी नहीं मिली। संजय के प्रोजेक्ट्स, स्किल्स, या स्कूल की कहानियों के बारे में पूछें!' : 'Sorry, I couldn\'t find specific information. Try asking about Sanjay’s projects, skills, or school stories!');
      }
      quickReplies = currentLang === 'hi'
        ? ['इस पर और विस्तार से बताएं?', 'संजय के स्कूल के दिन कैसे थे?', 'संजय की एक मज़ेदार कहानी बताएं!']
        : ['Can you elaborate on this?', 'What were Sanjay’s school days like?', 'Tell me a funny story about Sanjay!'];
    } catch (error) {
      console.error('Both API requests failed:', error.message);
      const searchResults = await performWebSearch(message);
      aiResponse = searchResults || (currentLang === 'hi' ? 'कुछ गड़बड़ हो गई। कृपया फिर से प्रयास करें या संजय के प्रोजेक्ट्स, स्किल्स, या स्कूल की कहानियों के बारे में पूछें!' : 'Something went wrong. Please try again or ask about Sanjay’s projects, skills, or school stories!');
      quickReplies = currentLang === 'hi'
        ? ['दूसरा प्रश्न पूछें', 'संजय के प्रोजेक्ट्स के बारे में पूछें', 'संजय की स्कूल की कहानी बताएं']
        : ['Try another question', 'Ask about Sanjay’s projects', 'Tell me a school story about Sanjay'];
    }

    const responseId = Date.now();
    window.messages.push({ sender: 'ai', text: '', id: responseId, timestamp: new Date().toISOString(), category: projectDetails ? 'project' : category, reactions: [], isPinned: false });
    await typeMessage(aiResponse, responseId, projectDetails, quickReplies);

    if (isAutoReplyEnabled) {
      setTimeout(function() {
        const followUpId = Date.now() + 1;
        window.messages.push({
          sender: 'ai',
          text: '',
          id: followUpId,
          timestamp: new Date().toISOString(),
          category: 'follow-up',
          reactions: [],
          isPinned: false
        });
        typeMessage(
          currentLang === 'hi' ? 'संजय के काम, स्किल्स, या स्कूल की कहानियों के बारे में और कोई प्रश्न हैं?' : 'Do you have any more questions about Sanjay’s work, skills, or school stories?',
          followUpId,
          null,
          currentLang === 'hi'
            ? ['संजय के प्रोजेक्ट्स क्या हैं?', 'संजय की स्किल्स क्या हैं?', 'संजय की स्कूल की मज़ेदार कहानी बताएं']
            : ['What are Sanjay’s projects?', 'What skills does Sanjay have?', 'Tell me a funny school story about Sanjay']
        );
      }, 2000);
    }

    isLoading = false;
    renderMessages();
  }

  function renderMessages() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) {
      console.error('Error: #chat-messages element not found');
      return;
    }
    chatMessages.innerHTML = '';
    const filteredMessages = searchQuery
      ? window.messages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
      : selectedCategory
      ? window.messages.filter(m => m.category === selectedCategory)
      : window.messages;

    if (filteredMessages.length === 0) {
      console.warn('No messages to render');
      chatMessages.innerHTML = '<div class="no-messages">No messages found</div>';
    }

    filteredMessages.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!b.isPinned && b.isPinned) return 1;
      return new Date(a.timestamp) - new Date(b.timestamp);
    });

    filteredMessages.forEach(function(message) {
      if (!message.reactions) message.reactions = [];
      const messageDiv = document.createElement('div');
      messageDiv.className = `message-container flex mb-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`;
      messageDiv.dataset.messageId = message.id;
      const bubbleDiv = document.createElement('div');
      bubbleDiv.className = `relative max-w-[80%] p-3 rounded-lg ${message.sender === 'user' ? 'user-message' : 'ai-message'} ${message.isPinned ? 'border-2 border-yellow-500' : ''}`;
      const messageContent = document.createElement('div');
      messageContent.className = 'message-content';
      messageContent.style.fontSize = `${fontSize}px`;
      let formattedText = formatMarkdown(message.text);
      if (message.category === 'project' && message.projectDetails) {
        formattedText = renderProjectCard(message.text, message.projectDetails);
      }
      if (editingMessageId === message.id) {
        messageContent.innerHTML =
          '<div class="edit-message flex items-center gap-2">' +
            '<input type="text" class="edit-message-input flex-1 p-2 border rounded-lg bg-[#F5F5F5] dark:bg-[#2A3942] text-black dark:text-[#E6E6FA]" value="' + editedText.replace(/"/g, '&quot;') + '">' +
            '<button class="edit-message-button bg-[#128C7E] text-white p-2 rounded-lg"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></button>' +
            '<button class="cancel-btn bg-[#FF4D4F] text-white p-2 rounded-lg"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>' +
          '</div>';
      } else {
        messageContent.innerHTML = formattedText;
        if (showTimestamps) {
          const timeSpan = document.createElement('span');
          timeSpan.className = 'message-timestamp';
          timeSpan.textContent = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          messageContent.appendChild(timeSpan);
        }
        if (message.reactions.length > 0) {
          messageContent.innerHTML += '<div class="message-reactions flex flex-wrap gap-1 mt-1">' + message.reactions.map(r => `<span class="reaction-tag bg-[#F5F5F5] dark:bg-[#2A3942] rounded-full px-2 py-1 text-sm">${r}</span>`).join('') + '</div>';
        }
        // Add tone buttons for tone_prompt messages
        if (message.category === 'tone_prompt') {
          const toneButtons = document.createElement('div');
          toneButtons.className = 'tone-buttons flex gap-2 mt-2';
          toneButtons.innerHTML = `
            <button class="tone-btn funny-btn bg-[var(--chat-border-light)] dark:bg-[var(--chat-border-dark)] text-white dark:text-[var(--chat-text-dark)] p-2 rounded-lg text-sm">${currentLang === 'hi' ? 'मज़ेदार' : 'Funny'}</button>
            <button class="tone-btn professional-btn bg-[var(--chat-border-light)] dark:bg-[var(--chat-border-dark)] text-white dark:text-[var(--chat-text-dark)] p-2 rounded-lg text-sm">${currentLang === 'hi' ? 'पेशेवर' : 'Professional'}</button>
          `;
          messageContent.appendChild(toneButtons);
          toneButtons.querySelector('.funny-btn').addEventListener('click', () => {
            window.messages = window.messages.filter(m => m.id !== message.id); // Remove tone prompt
            processMessageWithTone(pendingMessage, pendingMessageId, 'funny');
            renderMessages();
          });
          toneButtons.querySelector('.professional-btn').addEventListener('click', () => {
            window.messages = window.messages.filter(m => m.id !== message.id); // Remove tone prompt
            processMessageWithTone(pendingMessage, pendingMessageId, 'professional');
            renderMessages();
          });
        }
      }
      if (message.sender === 'ai' && message.text && typeof window.speakMessage === 'function' && message.category !== 'tone_prompt') {
        const speakBtn = document.createElement('button');
        speakBtn.className = 'speak-btn';
        speakBtn.setAttribute('aria-label', 'Play or pause message');
        speakBtn.innerHTML = message.isSpeaking
          ? `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6"></path></svg>`
          : `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-6.504-3.753v7.506l6.504-3.753zM5 3v18l14-9L5 3z"></path></svg>`;
        speakBtn.addEventListener('click', () => window.speakMessage(message.id, message.text, currentLang));
        bubbleDiv.appendChild(speakBtn);
      }
      const messageActions = document.createElement('div');
      messageActions.className = 'message-actions flex justify-end gap-2 mt-2';
      if (message.sender === 'user') {
        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn bg-[rgba(0,0,0,0.1)] dark:bg-[#2A3942] p-2 rounded-full';
        editBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>';
        editBtn.addEventListener('click', function() { startEditing(message.id, message.text); });
        messageActions.appendChild(editBtn);
      }
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'action-btn bg-[rgba(0,0,0,0.1)] dark:bg-[#2A3942] p-2 rounded-full';
      deleteBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4"></path></svg>';
      deleteBtn.addEventListener('click', function() { deleteMessage(message.id); });
      const copyBtn = document.createElement('button');
      copyBtn.className = 'action-btn bg-[rgba(0,0,0,0.1)] dark:bg-[#2A3942] p-2 rounded-full';
      copyBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>';
      copyBtn.addEventListener('click', function() { copyMessage(message.text); });
      const pinBtn = document.createElement('button');
      pinBtn.className = 'action-btn bg-[rgba(0,0,0,0.1)] dark:bg-[#2A3942] p-2 rounded-full';
      pinBtn.innerHTML = message.isPinned ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v7m-7 7h7m-7-7h14"></path></svg>' : '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>';
      pinBtn.addEventListener('click', function() { togglePinMessage(message.id); });
      const reactionBtn = document.createElement('button');
      reactionBtn.className = 'action-btn bg-[rgba(0,0,0,0.1)] dark:bg-[#2A3942] p-2 rounded-full';
      reactionBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
      reactionBtn.addEventListener('click', function() { showReactionPicker(message.id, bubbleDiv); });
      messageActions.appendChild(deleteBtn);
      messageActions.appendChild(copyBtn);
      messageActions.appendChild(pinBtn);
      messageActions.appendChild(reactionBtn);
      bubbleDiv.appendChild(messageContent);
      bubbleDiv.appendChild(messageActions);
      messageDiv.appendChild(bubbleDiv);
      chatMessages.appendChild(messageDiv);
    });

    if (isLoading) {
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'flex justify-start mb-2';
      loadingDiv.innerHTML = '<div class="ai-message p-3 rounded-lg rounded-bl-none max-w-[80%] flex items-center"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
      chatMessages.appendChild(loadingDiv);
    }

    try {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (e) {
      console.error('Error scrolling chat messages:', e);
    }
    updateTimestamps();
    updateButtonStates();
    localStorage.setItem('portfolio-chat', JSON.stringify(window.messages));
    console.log('Messages rendered:', window.messages.length);
  }

  function formatMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-[#2A3942] p-1 rounded">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-blue-500 underline">$1</a>')
      .replace(/^- (.*)$/gm, '<li>$1</li>')
      .replace(/(\n<li>.*<\/li>)+/g, '<ul class="list-disc pl-5">$&</ul>')
      .replace(/\n/g, '<br>');
  }

  function renderProjectCard(text, details = {}) {
    if (!details) return formatMarkdown(text);
    return `
      <div class="project-card-content p-3 bg-blue-50 dark:bg-[#2A3942] rounded-lg">
        <h4 class="text-base font-bold">${details.name || 'Project'}</h4>
        <p>${formatMarkdown(text)}</p>
        ${details.metrics ? `<p><strong>Metrics:</strong> ${details.metrics}</p>` : ''}
        ${details.tech ? `<p><strong>Tech:</strong> ${details.tech}</p>` : ''}
        ${details.link ? `<a href="${details.link}" target="_blank" rel="noopener" class="text-blue-500 underline">Learn More</a>` : ''}
      </div>
    `;
  }

  function updateTimestamps() {
    const timestamps = document.querySelectorAll('.message-timestamp');
    timestamps.forEach(function(timestamp) {
      const messageId = timestamp.closest('[data-message-id]').dataset.messageId;
      const message = window.messages.find(function(message) { return message.id === messageId; });
      if (message) timestamp.textContent = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
  }

  function updateButtonStates() {
    const clearBtn = document.querySelector('.clear-btn');
    if (clearBtn) clearBtn.disabled = window.messages.length === 1 && window.messages[0].id === 'welcome';
    const sendBtn = document.querySelector('.send-btn');
    if (sendBtn) sendBtn.disabled = isLoading;
    const voiceBtn = document.querySelector('.voice-btn');
    if (voiceBtn) voiceBtn.disabled = isLoading || !recognition;
    document.querySelectorAll('.suggestion-btn').forEach(function(btn) { btn.disabled = isLoading; });
  }

  async function typeMessage(text, messageId, projectDetails = null, quickReplies = []) {
    const message = window.messages.find(m => m.id === messageId);
    if (!message) {
      console.error('Message not found for ID:', messageId);
      return;
    }
    message.text = text;
    if (projectDetails) message.projectDetails = projectDetails;
    if (quickReplies.length > 0) message.quickReplies = quickReplies;
    if (isAutoSpeakEnabled && message.sender === 'ai' && typeof window.speakMessage === 'function' && message.category !== 'tone_prompt') {
      window.speakMessage(messageId, text, currentLang);
      interactionAnalytics.speechUsed++;
    }
    renderMessages();
  }

  async function sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input) {
      console.error('Error: #chat-input element not found');
      return;
    }
    const message = input.value.trim();
    if (!message || isLoading) return;

    const messageId = Date.now();
    window.messages.push({ sender: 'user', text: message, id: messageId, timestamp: new Date().toISOString(), category: categorizeMessage(message), reactions: [], isPinned: false });
    input.value = '';
    renderMessages();
    showTonePicker(message, messageId);
  }

  async function performWebSearch(query) {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('sanjay patidar')) {
      return currentLang === 'hi'
        ? `संजय पाटीदार एक फुल-स्टैक इंजीनियर हैं, जो अरावली सादन के कैप्टन और पोहे के दीवाने रहे। अधिक जानकारी के लिए उनका [LinkedIn](https://linkedin.com/in/sanjay-patidar) देखें।`
        : `Sanjay Patidar is a Full-Stack Engineer, once the captain of Aravali Sadan and a pohe enthusiast. Check his [LinkedIn](https://linkedin.com/in/sanjay-patidar) for more details.`;
    }
    return currentLang === 'hi'
      ? `"${query}" पर सामान्य जानकारी: अधिक संदर्भ प्रदान करें या संजय के प्रोजेक्ट्स, स्किल्स, या स्कूल की कहानियों के लिए पूछें।`
      : `General information on "${query}": Please provide more context or ask about Sanjay’s projects, skills, or school stories.`;
  }

  function categorizeMessage(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('project') || lowerMessage.includes('lic neemuch') || lowerMessage.includes('zedemy') || lowerMessage.includes('connectnow') || lowerMessage.includes('eventease') || lowerMessage.includes('eduxcel') || lowerMessage.includes('प्रोजेक्ट') || lowerMessage.includes('lic नीमच') || lowerMessage.includes('जेडेमी') || lowerMessage.includes('कनेक्टनाउ') || lowerMessage.includes('इवेंटईज') || lowerMessage.includes('एडुक्सेल')) {
      return 'project';
    } else if (lowerMessage.includes('skill') || lowerMessage.includes('frontend') || lowerMessage.includes('backend') || lowerMessage.includes('cloud') || lowerMessage.includes('seo') || lowerMessage.includes('ci/cd') || lowerMessage.includes('security') || lowerMessage.includes('स्किल') || lowerMessage.includes('फ्रंटएंड') || lowerMessage.includes('बैकएंड') || lowerMessage.includes('क्लाउड') || lowerMessage.includes('एसईओ') || lowerMessage.includes('सीआई/सीडी') || lowerMessage.includes('सुरक्षा')) {
      return 'skills';
    } else if (lowerMessage.includes('achievement') || lowerMessage.includes('load time') || lowerMessage.includes('impression') || lowerMessage.includes('उपलब्धि') || lowerMessage.includes('लोड टाइम') || lowerMessage.includes('इंप्रेशन')) {
      return 'achievements';
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('collaboration') || lowerMessage.includes('संपर्क') || lowerMessage.includes('सहयोग')) {
      return 'contact';
    } else if (lowerMessage.includes('challenge') || lowerMessage.includes('deadline') || lowerMessage.includes('setback') || lowerMessage.includes('conflict') || lowerMessage.includes('learn') || lowerMessage.includes('चुनौती') || lowerMessage.includes('डेडलाइन') || lowerMessage.includes('असफलता') || lowerMessage.includes('संघर्ष') || lowerMessage.includes('सीखना')) {
      return 'challenges';
    } else if (lowerMessage.includes('who is sanjay') || lowerMessage.includes('संजय कौन') || lowerMessage.includes('life') || lowerMessage.includes('story') || lowerMessage.includes('school') || lowerMessage.includes('navodaya') || lowerMessage.includes('hobby') || lowerMessage.includes('जीवन') || lowerMessage.includes('कहानी') || lowerMessage.includes('स्कूल') || lowerMessage.includes('नवोदय') || lowerMessage.includes('शौक')) {
      return 'personal';
    } else {
      return 'general';
    }
  }

  function filterByCategory(category) {
    selectedCategory = category;
    searchQuery = '';
    const searchBar = document.getElementById('search-bar');
    if (searchBar) searchBar.value = '';
    renderMessages();
    handleInputChange('');
  }

  function handlePromptClick(prompt) {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
      chatInput.value = prompt;
      sendMessage();
    }
  }

  function handleQuickReply(prompt) {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
      chatInput.value = prompt;
      sendMessage();
    }
  }

  function handleInputChange(value) {
    const suggestionsContainer = document.getElementById('chat-suggestions');
    if (suggestionsContainer) {
      filteredSuggestions = value.trim() ? suggestedPrompts[currentLang].filter(function(prompt) { return prompt.toLowerCase().includes(value.toLowerCase()); }) : suggestedPrompts[currentLang];
      suggestionsContainer.innerHTML = filteredSuggestions.map(function(prompt) {
        return '<button class="suggestion-btn">' + prompt + '</button>';
      }).join('');
      suggestionsContainer.querySelectorAll('.suggestion-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => handlePromptClick(filteredSuggestions[index]));
      });
    }
    updateButtonStates();
  }

  function showReactionPicker(messageId, messageDiv) {
    const existingPicker = messageDiv.querySelector('.reaction-picker');
    if (existingPicker) {
      existingPicker.remove();
      return;
    }
    const picker = document.createElement('div');
    picker.className = 'reaction-picker absolute bg-white dark:bg-[#2A3942] border rounded-lg p-2 flex gap-2 z-10';
    emojiOptions.forEach(emoji => {
      const btn = document.createElement('button');
      btn.textContent = emoji;
      btn.className = 'reaction-picker-item text-lg';
      btn.addEventListener('click', function() { addReaction(messageId, emoji); picker.remove(); });
      picker.appendChild(btn);
    });
    messageDiv.appendChild(picker);
    const message = window.messages.find(m => m.id === messageId);
    picker.style.top = '100%';
    picker.style.left = message.sender === 'user' ? 'auto' : '0';
    picker.style.right = message.sender === 'user' ? '0' : 'auto';
  }

  function addReaction(messageId, emoji) {
    const message = window.messages.find(m => m.id === messageId);
    if (message) {
      message.reactions = message.reactions || [];
      if (!message.reactions.includes(emoji)) {
        message.reactions.push(emoji);
        interactionAnalytics.reactionsUsed++;
        renderMessages();
        localStorage.setItem('portfolio-chat', JSON.stringify(window.messages));
      }
    }
  }

  function togglePinMessage(messageId) {
    const message = window.messages.find(m => m.id === messageId);
    if (message) {
      message.isPinned = !message.isPinned;
      renderMessages();
      localStorage.setItem('portfolio-chat', JSON.stringify(window.messages));
    }
  }

  function startEditing(id, text) {
    editingMessageId = id;
    editedText = text;
    renderMessages();
    const editInput = document.querySelector('.edit-message-input');
    if (editInput) {
      editInput.focus();
      editInput.addEventListener('input', (e) => editedText = e.target.value);
      editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveEditedMessage(id);
      });
    }
    const saveBtn = document.querySelector('.edit-message-button');
    if (saveBtn) saveBtn.addEventListener('click', () => saveEditedMessage(id));
    const cancelBtn = document.querySelector('.cancel-btn');
    if (cancelBtn) cancelBtn.addEventListener('click', cancelEdit);
  }

  async function saveEditedMessage(id) {
    if (editedText.trim()) {
      window.messages = window.messages.map(function(message) {
        return message.id === id ? { ...message, text: editedText, timestamp: new Date().toISOString(), category: categorizeMessage(editedText) } : message;
      });
      editingMessageId = null;
      const editedMessageText = editedText;
      editedText = '';
      renderMessages();
      showTonePicker(editedMessageText, id);
    } else {
      editingMessageId = null;
      editedText = '';
      renderMessages();
    }
  }

  function cancelEdit() {
    editingMessageId = null;
    editedText = '';
    renderMessages();
  }

  function deleteMessage(id) {
    window.messages = window.messages.filter(function(message) { return message.id !== id; });
    if (window.messages.length === 0) {
      window.messages.push({
        sender: 'ai',
        text: currentLang === 'hi' ? 'हाय! मैं संजय पाटीदार का पोर्टफोलियो चैटबॉट हूँ। उनके प्रोजेक्ट्स, स्किल्स, या स्कूल की कहानियों के बारे में पूछें, जैसे "संजय पाटीदार कौन हैं?" या "संजय की स्कूल की मज़ेदार कहानी बताएं!"' : 'Hi! I\'m Sanjay Patidar\'s portfolio chatbot. Ask about his projects, skills, or school stories, like "Who is Sanjay Patidar?" or "Tell me a funny school story about Sanjay!"',
        id: 'welcome',
        timestamp: new Date().toISOString(),
        category: 'welcome',
        reactions: [],
        isPinned: false
      });
    }
    renderMessages();
    localStorage.setItem('portfolio-chat', JSON.stringify(window.messages));
  }

  function copyMessage(text) {
    navigator.clipboard.writeText(text).then(function() {
      alert(currentLang === 'hi' ? 'संदेश कॉपी किया गया!' : 'Message copied!');
    }).catch(function() {
      alert(currentLang === 'hi' ? 'कॉपी करने में असफल!' : 'Failed to copy!');
    });
  }

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.getElementById('chatbot-container').classList.toggle('dark', isDarkMode);
    const themeBtn = document.querySelector('.theme-btn');
    if (themeBtn) {
      themeBtn.innerHTML = isDarkMode
        ? '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>'
        : '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>';
    }
    renderMessages();
  }

  function toggleControls() {
    const controls = document.getElementById('chat-controls');
    if (controls) {
      controls.classList.toggle('hidden');
      const toggleBtn = document.querySelector('.controls-toggle');
      if (toggleBtn) {
        toggleBtn.innerHTML = controls.classList.contains('hidden')
          ? '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>'
          : '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
      }
    }
  }

  function toggleSearchBar() {
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
      searchBar.classList.toggle('hidden');
      if (!searchBar.classList.contains('hidden')) {
        searchBar.focus();
      }
    }
  }

  function searchMessages(query) {
    searchQuery = query;
    selectedCategory = '';
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) categoryFilter.value = '';
    renderMessages();
  }

  function toggleHistory() {
    isHistoryCollapsed = !isHistoryCollapsed;
    const historyBtn = document.querySelector('.history-btn');
    if (historyBtn) {
      historyBtn.textContent = isHistoryCollapsed ? (currentLang === 'hi' ? 'इतिहास दिखाएं' : 'Show History') : (currentLang === 'hi' ? 'इतिहास छिपाएं' : 'Hide History');
    }
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
      chatMessages.style.display = isHistoryCollapsed ? 'none' : 'block';
    }
    if (!isHistoryCollapsed) renderMessages();
  }

  function toggleAutoReply() {
    isAutoReplyEnabled = !isAutoReplyEnabled;
    const autoReplyBtn = document.querySelector('.auto-reply-btn');
    if (autoReplyBtn) {
      autoReplyBtn.textContent = isAutoReplyEnabled ? (currentLang === 'hi' ? 'ऑटो-रिप्लाई: चालू' : 'Auto-Reply: On') : (currentLang === 'hi' ? 'ऑटो-रिप्लाई: बंद' : 'Auto-Reply: Off');
    }
  }

  function toggleAutoSpeak() {
    isAutoSpeakEnabled = !isAutoSpeakEnabled;
    const autoSpeakBtn = document.querySelector('.auto-speak-btn');
    if (autoSpeakBtn) {
      autoSpeakBtn.textContent = isAutoSpeakEnabled ? (currentLang === 'hi' ? 'ऑटो-स्पीक: चालू' : 'Auto-Speak: On') : (currentLang === 'hi' ? 'ऑटो-स्पीक: बंद' : 'Auto-Speak: Off');
    }
  }

  function toggleTimestamps() {
    showTimestamps = !showTimestamps;
    const timestampBtn = document.querySelector('.timestamp-btn');
    if (timestampBtn) {
      timestampBtn.textContent = showTimestamps ? (currentLang === 'hi' ? 'टाइमस्टैम्प छिपाएं' : 'Hide Timestamps') : (currentLang === 'hi' ? 'टाइमस्टैम्प दिखाएं' : 'Show Timestamps');
    }
    renderMessages();
  }

  function adjustFontSize(change) {
    fontSize = Math.max(10, Math.min(18, fontSize + change));
    localStorage.setItem('chat-font-size', fontSize);
    const elements = document.querySelectorAll('.chatbot-container .message-content, .chatbot-container .chat-input, .chatbot-container .search-bar, .chatbot-container .suggestion-btn, .chatbot-container .message-actions');
    elements.forEach(function(element) {
      element.style.setProperty('font-size', `${fontSize}px`, 'important');
    });
    console.log(`Font size adjusted to ${fontSize}px, affected ${elements.length} elements`);
  }

  function confirmClearChat() {
    const confirmPopup = document.createElement('div');
    confirmPopup.className = 'confirm-popup';
    confirmPopup.innerHTML = `
      <p>${currentLang === 'hi' ? 'क्या आप वाकई चैट इतिहास मिटाना चाहते हैं?' : 'Are you sure you want to clear the chat history?'}</p>
      <button class="confirm-btn">${currentLang === 'hi' ? 'हाँ' : 'Yes'}</button>
      <button class="cancel-btn">${currentLang === 'hi' ? 'नहीं' : 'No'}</button>
    `;
    document.getElementById('chatbot-container').appendChild(confirmPopup);
    const confirmBtn = confirmPopup.querySelector('.confirm-btn');
    const cancelBtn = confirmPopup.querySelector('.cancel-btn');
    if (confirmBtn) confirmBtn.addEventListener('click', clearChat);
    if (cancelBtn) cancelBtn.addEventListener('click', () => confirmPopup.remove());
  }

  function clearChat() {
    window.messages = [{
      sender: 'ai',
      text: currentLang === 'hi' ? 'हाय! मैं संजय पाटीदार का पोर्टफोलियो चैटबॉट हूँ। उनके प्रोजेक्ट्स, स्किल्स, या स्कूल की कहानियों के बारे में पूछें, जैसे "संजय पाटीदार कौन हैं?" या "संजय की स्कूल की मज़ेदार कहानी बताएं!"' : 'Hi! I\'m Sanjay Patidar\'s portfolio chatbot. Ask about his projects, skills, or school stories, like "Who is Sanjay Patidar?" or "Tell me a funny school story about Sanjay!"',
      id: 'welcome',
      timestamp: new Date().toISOString(),
      category: 'welcome',
      reactions: [],
      isPinned: false
    }];
    localStorage.setItem('portfolio-chat', JSON.stringify(window.messages));
    renderMessages();
    document.querySelectorAll('.confirm-popup').forEach(p => p.remove());
  }

  function toggleRecording() {
    if (!recognition) {
      alert(currentLang === 'hi' ? 'क्ष inequity करें, आपके ब्राउज़र में वॉइस इनपुट समर्थित नहीं है।' : 'Sorry, voice input is not supported in your browser.');
      return;
    }
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
      recognition.start();
      isRecording = true;
      const voiceBtn = document.querySelector('.voice-btn');
      if (voiceBtn) voiceBtn.classList.add('recording');
    }
  }

  if (recognition) {
    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      const chatInput = document.getElementById('chat-input');
      if (chatInput) {
        chatInput.value = transcript;
        isRecording = false;
        const voiceBtn = document.querySelector('.voice-btn');
        if (voiceBtn) voiceBtn.classList.remove('recording');
        const messageId = Date.now();
        window.messages.push({ sender: 'user', text: transcript, id: messageId, timestamp: new Date().toISOString(), category: categorizeMessage(transcript), reactions: [], isPinned: false });
        renderMessages();
        showTonePicker(transcript, messageId);
      }
    };
    recognition.onend = function() {
      isRecording = false;
      const voiceBtn = document.querySelector('.voice-btn');
      if (voiceBtn) voiceBtn.classList.remove('recording');
    };
    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
      isRecording = false;
      const voiceBtn = document.querySelector('.voice-btn');
      if (voiceBtn) voiceBtn.classList.remove('recording');
      alert(currentLang === 'hi' ? 'वॉइस रिकग्निशन में त्रुटि: ' + event.error : 'Voice recognition error: ' + event.error);
    };
  }

  document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) {
      console.error('Critical: #chat-messages element not found on DOM load');
      return;
    }
    chatMessages.style.display = 'block';
    renderMessages();
    handleInputChange('');

    const controlsToggle = document.querySelector('.controls-toggle');
    if (controlsToggle) controlsToggle.addEventListener('click', toggleControls);

    const searchToggle = document.querySelector('.search-toggle');
    if (searchToggle) searchToggle.addEventListener('click', toggleSearchBar);

    const themeBtn = document.querySelector('.theme-btn');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    const langToggle = document.querySelector('.lang-toggle');
    if (langToggle) {
      langToggle.addEventListener('click', function() {
        currentLang = currentLang === 'en' ? 'hi' : 'en';
        localStorage.setItem('chat-lang', currentLang);
        document.getElementById('chatbot-container').setAttribute('lang', currentLang);
        langToggle.setAttribute('data-lang', currentLang === 'en' ? 'hi' : 'en');
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
          chatInput.placeholder = currentLang === 'hi' ? chatInput.dataset.placeholderHi : 'Ask about Sanjay\'s projects or skills...';
        }
        const searchBar = document.getElementById('search-bar');
        if (searchBar) {
          searchBar.placeholder = currentLang === 'hi' ? searchBar.dataset.placeholderHi : 'Search Messages';
        }
        handleInputChange(document.getElementById('chat-input').value);
        filteredSuggestions = suggestedPrompts[currentLang];
        renderMessages();
        if (typeof window.stopAllSpeech === 'function') window.stopAllSpeech();
      });
    }

    const searchBar = document.getElementById('search-bar');
    if (searchBar) searchBar.addEventListener('input', (e) => searchMessages(e.target.value));

    const historyBtn = document.querySelector('.history-btn');
    if (historyBtn) historyBtn.addEventListener('click', toggleHistory);

    const autoReplyBtn = document.querySelector('.auto-reply-btn');
    if (autoReplyBtn) autoReplyBtn.addEventListener('click', toggleAutoReply);

    const autoSpeakBtn = document.querySelector('.auto-speak-btn');
    if (autoSpeakBtn) autoSpeakBtn.addEventListener('click', toggleAutoSpeak);

    const timestampBtn = document.querySelector('.timestamp-btn');
    if (timestampBtn) timestampBtn.addEventListener('click', toggleTimestamps);

    const volumeControl = document.getElementById('volume-control');
    if (volumeControl) volumeControl.addEventListener('input', function(e) {
      if (typeof window.setSpeechVolume === 'function') window.setSpeechVolume(e.target.value);
    });

    const rateControl = document.getElementById('rate-control');
    if (rateControl) rateControl.addEventListener('input', function(e) {
      if (typeof window.setSpeechRate === 'function') window.setSpeechRate(e.target.value);
    });

    document.querySelectorAll('.font-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const change = btn.textContent.includes('Increase') ? 2 : -2;
        adjustFontSize(change);
      });
    });

    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) categoryFilter.addEventListener('change', (e) => filterByCategory(e.target.value));

    const clearBtn = document.querySelector('.clear-btn');
    if (clearBtn) clearBtn.addEventListener('click', confirmClearChat);

    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
      chatInput.addEventListener('input', (e) => handleInputChange(e.target.value));
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
      });
    }

    const voiceBtn = document.querySelector('.voice-btn');
    if (voiceBtn) voiceBtn.addEventListener('click', toggleRecording);

    const sendBtn = document.querySelector('.send-btn');
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);

    adjustFontSize(0);
  });
})();
