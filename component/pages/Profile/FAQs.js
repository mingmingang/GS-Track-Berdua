import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../backbone/Header";
import styles from "../../styles/FaqStyles";
import i18n from "../../backbone/i18n";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const faqData = [
  {
    questionKey: "faq_q1",
    answerKey: "faq_a1",
  },
  {
    questionKey: "faq_q2",
    answerKey: "faq_a2",
  },
  {
    questionKey: "faq_q3",
    answerKey: "faq_a3",
  },
  {
    questionKey: "faq_q4",
    answerKey: "faq_a4",
  },
  {
    questionKey: "faq_q5",
    answerKey: "faq_a5",
  },
  {
    questionKey: "faq_q6",
    answerKey: "faq_a6",
  },
  {
    questionKey: "faq_q7",
    answerKey: "faq_a7",
  },
  {
    questionKey: "faq_q8",
    answerKey: "faq_a8",
  },
  {
    questionKey: "faq_q9",
    answerKey: "faq_a9",
  },
  {
    questionKey: "faq_q10",
    answerKey: "faq_a10",
  },
  {
    questionKey: "faq_q11",
    answerKey: "faq_a11",
  },
  {
    questionKey: "faq_q12",
    answerKey: "faq_a12",
  },
  {
    questionKey: "faq_q13",
    answerKey: "faq_a13",
  },
  {
    questionKey: "faq_q14",
    answerKey: "faq_a14",
  },
  {
    questionKey: "faq_q15",
    answerKey: "faq_a15",
  },
  {
    questionKey: "faq_q16",
    answerKey: "faq_a16",
  },
  {
    questionKey: "faq_q17",
    answerKey: "faq_a17",
  },
  {
    questionKey: "faq_q18",
    answerKey: "faq_a18",
  },
];

export default function FaqScreen() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <>
      <Header title="FAQ" />
      <ScrollView contentContainerStyle={styles.container}>
        {faqData.map((faq, index) => (
          <View key={index} style={styles.card}>
            <TouchableOpacity
              style={styles.questionRow}
              onPress={() => toggleExpand(index)}
            >
              <Text style={styles.questionText}>{i18n.t(faq.questionKey)}</Text>
              <Ionicons
                name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                size={20}
              />
            </TouchableOpacity>
            {expandedIndex === index && (
              <Text style={styles.answerText}>{i18n.t(faq.answerKey)}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </>
  );
}
