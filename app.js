import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Selam kanka! Ben Fresh AI. Yerel, dinamik ve seninle birlikte gelişen asistanınım. Bugün ne yapmak istiyoruz?' }
  ]);
  const [input, setInput] = useState('');
  
  // Dynamic UI için tema state'leri
  const [themeColor, setThemeColor] = useState('#8B5CF6'); // Mor tema

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedColor = await AsyncStorage.getItem('@fresh_ai_theme');
      if (savedColor) setThemeColor(savedColor);
    } catch (e) {
      console.log('Ayarlar yüklenemedi', e);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');

    // Basit Dynamic UI / Self-Evolving Komut Simülasyonu
    setTimeout(() => {
      let reply = "Seni anladım kanka, bunu sisteme işliyorum.";
      
      if (userMsg.toLowerCase().includes('mavi yap')) {
        setThemeColor('#3B82F6');
        AsyncStorage.setItem('@fresh_ai_theme', '#3B82F6');
        reply = "Tamamdır kanka, arayüzü maviye çevirdim!";
      } else if (userMsg.toLowerCase().includes('mor yap')) {
        setThemeColor('#8B5CF6');
        AsyncStorage.setItem('@fresh_ai_theme', '#8B5CF6');
        reply = "Harika, mor rengimize geri döndük!";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#0F172A' }]}>
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <Text style={styles.headerTitle}>Fresh AI 🚀</Text>
        <Text style={styles.headerSubtitle}>Local & Self-Evolving</Text>
      </View>

      <ScrollView style={styles.chatContainer}>
        {messages.map((msg, index) => (
          <View key={index} style={[
            styles.bubble, 
            msg.role === 'user' ? styles.userBubble : [styles.aiBubble, { borderColor: themeColor }]
          ]}>
            <Text style={styles.text}>{msg.content}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Bir şeyler yaz (Örn: Ekranı mavi yap)..."
          placeholderTextColor="#94A3B8"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={[styles.sendButton, { backgroundColor: themeColor }]} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  headerSubtitle: { fontSize: 12, color: '#E2E8F0', marginTop: 4 },
  chatContainer: { flex: 1, padding: 16 },
  bubble: { padding: 14, borderRadius: 12, marginBottom: 12, maxWidth: '80%' },
  userBubble: { backgroundColor: '#334155', alignSelf: 'flex-end' },
  aiBubble: { backgroundColor: '#1E293B', alignSelf: 'flex-start', borderWidth: 1 },
  text: { color: '#F8FAFC', fontSize: 15 },
  inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: '#1E293B' },
  input: { flex: 1, backgroundColor: '#0F172A', color: '#FFF', paddingHorizontal: 16, borderRadius: 8, height: 45 },
  sendButton: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, borderRadius: 8, marginLeft: 8 },
  sendButtonText: { color: '#FFF', fontWeight: 'bold' }
});