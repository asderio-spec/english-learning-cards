// English sentence data for each grade level
// Each grade contains 100 sentences commonly found in Korean English textbooks

import type { Grade, Sentence } from '../types';

// Middle School Grade 1 sentences
const middle1Sentences: Omit<Sentence, 'isImportant' | 'studyCount' | 'lastStudied'>[] = [
  { id: 'm1_001', korean: '안녕하세요.', english: 'Hello.', grade: 'middle1' },
  { id: 'm1_002', korean: '제 이름은 김민수입니다.', english: 'My name is Kim Minsu.', grade: 'middle1' },
  { id: 'm1_003', korean: '만나서 반갑습니다.', english: 'Nice to meet you.', grade: 'middle1' },
  { id: 'm1_004', korean: '저는 13살입니다.', english: 'I am 13 years old.', grade: 'middle1' },
  { id: 'm1_005', korean: '저는 학생입니다.', english: 'I am a student.', grade: 'middle1' },
  { id: 'm1_006', korean: '이것은 책입니다.', english: 'This is a book.', grade: 'middle1' },
  { id: 'm1_007', korean: '저것은 펜입니다.', english: 'That is a pen.', grade: 'middle1' },
  { id: 'm1_008', korean: '여기는 교실입니다.', english: 'This is a classroom.', grade: 'middle1' },
  { id: 'm1_009', korean: '저기는 도서관입니다.', english: 'That is a library.', grade: 'middle1' },
  { id: 'm1_010', korean: '오늘은 월요일입니다.', english: 'Today is Monday.', grade: 'middle1' },
  { id: 'm1_011', korean: '내일은 화요일입니다.', english: 'Tomorrow is Tuesday.', grade: 'middle1' },
  { id: 'm1_012', korean: '어제는 일요일이었습니다.', english: 'Yesterday was Sunday.', grade: 'middle1' },
  { id: 'm1_013', korean: '지금은 오전 9시입니다.', english: 'It is 9 AM now.', grade: 'middle1' },
  { id: 'm1_014', korean: '저는 아침을 먹습니다.', english: 'I eat breakfast.', grade: 'middle1' },
  { id: 'm1_015', korean: '저는 학교에 갑니다.', english: 'I go to school.', grade: 'middle1' },
  { id: 'm1_016', korean: '저는 집에 옵니다.', english: 'I come home.', grade: 'middle1' },
  { id: 'm1_017', korean: '저는 숙제를 합니다.', english: 'I do homework.', grade: 'middle1' },
  { id: 'm1_018', korean: '저는 TV를 봅니다.', english: 'I watch TV.', grade: 'middle1' },
  { id: 'm1_019', korean: '저는 음악을 듣습니다.', english: 'I listen to music.', grade: 'middle1' },
  { id: 'm1_020', korean: '저는 책을 읽습니다.', english: 'I read a book.', grade: 'middle1' },
  { id: 'm1_021', korean: '저는 잠을 잡니다.', english: 'I sleep.', grade: 'middle1' },
  { id: 'm1_022', korean: '저는 물을 마십니다.', english: 'I drink water.', grade: 'middle1' },
  { id: 'm1_023', korean: '저는 사과를 먹습니다.', english: 'I eat an apple.', grade: 'middle1' },
  { id: 'm1_024', korean: '저는 친구와 놉니다.', english: 'I play with friends.', grade: 'middle1' },
  { id: 'm1_025', korean: '저는 축구를 좋아합니다.', english: 'I like soccer.', grade: 'middle1' },
  { id: 'm1_026', korean: '저는 농구를 합니다.', english: 'I play basketball.', grade: 'middle1' },
  { id: 'm1_027', korean: '저는 수영을 할 수 있습니다.', english: 'I can swim.', grade: 'middle1' },
  { id: 'm1_028', korean: '저는 영어를 공부합니다.', english: 'I study English.', grade: 'middle1' },
  { id: 'm1_029', korean: '저는 수학을 배웁니다.', english: 'I learn math.', grade: 'middle1' },
  { id: 'm1_030', korean: '저는 과학을 좋아합니다.', english: 'I like science.', grade: 'middle1' },
  { id: 'm1_031', korean: '저는 미술을 그립니다.', english: 'I draw art.', grade: 'middle1' },
  { id: 'm1_032', korean: '저는 음악을 연주합니다.', english: 'I play music.', grade: 'middle1' },
  { id: 'm1_033', korean: '저는 컴퓨터를 사용합니다.', english: 'I use a computer.', grade: 'middle1' },
  { id: 'm1_034', korean: '저는 게임을 합니다.', english: 'I play games.', grade: 'middle1' },
  { id: 'm1_035', korean: '저는 영화를 봅니다.', english: 'I watch movies.', grade: 'middle1' },
  { id: 'm1_036', korean: '저는 쇼핑을 합니다.', english: 'I go shopping.', grade: 'middle1' },
  { id: 'm1_037', korean: '저는 요리를 합니다.', english: 'I cook.', grade: 'middle1' },
  { id: 'm1_038', korean: '저는 청소를 합니다.', english: 'I clean.', grade: 'middle1' },
  { id: 'm1_039', korean: '저는 빨래를 합니다.', english: 'I do laundry.', grade: 'middle1' },
  { id: 'm1_040', korean: '저는 산책을 합니다.', english: 'I take a walk.', grade: 'middle1' },
  { id: 'm1_041', korean: '날씨가 좋습니다.', english: 'The weather is nice.', grade: 'middle1' },
  { id: 'm1_042', korean: '비가 옵니다.', english: 'It rains.', grade: 'middle1' },
  { id: 'm1_043', korean: '눈이 옵니다.', english: 'It snows.', grade: 'middle1' },
  { id: 'm1_044', korean: '바람이 붑니다.', english: 'The wind blows.', grade: 'middle1' },
  { id: 'm1_045', korean: '해가 뜹니다.', english: 'The sun rises.', grade: 'middle1' },
  { id: 'm1_046', korean: '달이 뜹니다.', english: 'The moon rises.', grade: 'middle1' },
  { id: 'm1_047', korean: '별이 빛납니다.', english: 'Stars shine.', grade: 'middle1' },
  { id: 'm1_048', korean: '꽃이 예쁩니다.', english: 'Flowers are pretty.', grade: 'middle1' },
  { id: 'm1_049', korean: '나무가 큽니다.', english: 'Trees are big.', grade: 'middle1' },
  { id: 'm1_050', korean: '새가 날아갑니다.', english: 'Birds fly.', grade: 'middle1' },
  { id: 'm1_051', korean: '고양이가 귀엽습니다.', english: 'Cats are cute.', grade: 'middle1' },
  { id: 'm1_052', korean: '개가 짖습니다.', english: 'Dogs bark.', grade: 'middle1' },
  { id: 'm1_053', korean: '물고기가 헤엄칩니다.', english: 'Fish swim.', grade: 'middle1' },
  { id: 'm1_054', korean: '토끼가 뜁니다.', english: 'Rabbits jump.', grade: 'middle1' },
  { id: 'm1_055', korean: '코끼리가 큽니다.', english: 'Elephants are big.', grade: 'middle1' },
  { id: 'm1_056', korean: '사자가 강합니다.', english: 'Lions are strong.', grade: 'middle1' },
  { id: 'm1_057', korean: '호랑이가 빠릅니다.', english: 'Tigers are fast.', grade: 'middle1' },
  { id: 'm1_058', korean: '원숭이가 똑똑합니다.', english: 'Monkeys are smart.', grade: 'middle1' },
  { id: 'm1_059', korean: '곰이 잠을 잡니다.', english: 'Bears sleep.', grade: 'middle1' },
  { id: 'm1_060', korean: '펭귄이 춥습니다.', english: 'Penguins are cold.', grade: 'middle1' },
  { id: 'm1_061', korean: '저는 빨간색을 좋아합니다.', english: 'I like red.', grade: 'middle1' },
  { id: 'm1_062', korean: '저는 파란색 옷을 입습니다.', english: 'I wear blue clothes.', grade: 'middle1' },
  { id: 'm1_063', korean: '저는 노란색 꽃을 봅니다.', english: 'I see yellow flowers.', grade: 'middle1' },
  { id: 'm1_064', korean: '저는 초록색 나무를 좋아합니다.', english: 'I like green trees.', grade: 'middle1' },
  { id: 'm1_065', korean: '저는 검은색 신발을 신습니다.', english: 'I wear black shoes.', grade: 'middle1' },
  { id: 'm1_066', korean: '저는 흰색 셔츠를 입습니다.', english: 'I wear a white shirt.', grade: 'middle1' },
  { id: 'm1_067', korean: '저는 분홍색을 예쁘다고 생각합니다.', english: 'I think pink is pretty.', grade: 'middle1' },
  { id: 'm1_068', korean: '저는 보라색 가방을 가지고 있습니다.', english: 'I have a purple bag.', grade: 'middle1' },
  { id: 'm1_069', korean: '저는 주황색 오렌지를 먹습니다.', english: 'I eat orange oranges.', grade: 'middle1' },
  { id: 'm1_070', korean: '저는 갈색 머리를 가지고 있습니다.', english: 'I have brown hair.', grade: 'middle1' },
  { id: 'm1_071', korean: '하나, 둘, 셋', english: 'One, two, three', grade: 'middle1' },
  { id: 'm1_072', korean: '넷, 다섯, 여섯', english: 'Four, five, six', grade: 'middle1' },
  { id: 'm1_073', korean: '일곱, 여덟, 아홉', english: 'Seven, eight, nine', grade: 'middle1' },
  { id: 'm1_074', korean: '열, 스무, 서른', english: 'Ten, twenty, thirty', grade: 'middle1' },
  { id: 'm1_075', korean: '마흔, 쉰, 예순', english: 'Forty, fifty, sixty', grade: 'middle1' },
  { id: 'm1_076', korean: '일흔, 여든, 아흔', english: 'Seventy, eighty, ninety', grade: 'middle1' },
  { id: 'm1_077', korean: '백, 천, 만', english: 'Hundred, thousand, ten thousand', grade: 'middle1' },
  { id: 'm1_078', korean: '저는 첫 번째입니다.', english: 'I am first.', grade: 'middle1' },
  { id: 'm1_079', korean: '저는 두 번째입니다.', english: 'I am second.', grade: 'middle1' },
  { id: 'm1_080', korean: '저는 세 번째입니다.', english: 'I am third.', grade: 'middle1' },
  { id: 'm1_081', korean: '저는 아버지를 사랑합니다.', english: 'I love my father.', grade: 'middle1' },
  { id: 'm1_082', korean: '저는 어머니를 사랑합니다.', english: 'I love my mother.', grade: 'middle1' },
  { id: 'm1_083', korean: '저는 형이 있습니다.', english: 'I have an older brother.', grade: 'middle1' },
  { id: 'm1_084', korean: '저는 누나가 있습니다.', english: 'I have an older sister.', grade: 'middle1' },
  { id: 'm1_085', korean: '저는 동생이 있습니다.', english: 'I have a younger sibling.', grade: 'middle1' },
  { id: 'm1_086', korean: '저는 할아버지를 존경합니다.', english: 'I respect my grandfather.', grade: 'middle1' },
  { id: 'm1_087', korean: '저는 할머니를 사랑합니다.', english: 'I love my grandmother.', grade: 'middle1' },
  { id: 'm1_088', korean: '우리 가족은 행복합니다.', english: 'Our family is happy.', grade: 'middle1' },
  { id: 'm1_089', korean: '저는 친구가 많습니다.', english: 'I have many friends.', grade: 'middle1' },
  { id: 'm1_090', korean: '저는 선생님을 좋아합니다.', english: 'I like my teacher.', grade: 'middle1' },
  { id: 'm1_091', korean: '저는 한국에 살고 있습니다.', english: 'I live in Korea.', grade: 'middle1' },
  { id: 'm1_092', korean: '저는 서울에서 왔습니다.', english: 'I come from Seoul.', grade: 'middle1' },
  { id: 'm1_093', korean: '저는 부산에 가고 싶습니다.', english: 'I want to go to Busan.', grade: 'middle1' },
  { id: 'm1_094', korean: '저는 제주도가 아름답다고 생각합니다.', english: 'I think Jeju Island is beautiful.', grade: 'middle1' },
  { id: 'm1_095', korean: '저는 미국에 가보고 싶습니다.', english: 'I want to visit America.', grade: 'middle1' },
  { id: 'm1_096', korean: '저는 영국을 여행하고 싶습니다.', english: 'I want to travel to England.', grade: 'middle1' },
  { id: 'm1_097', korean: '저는 일본 음식을 좋아합니다.', english: 'I like Japanese food.', grade: 'middle1' },
  { id: 'm1_098', korean: '저는 중국어를 배우고 싶습니다.', english: 'I want to learn Chinese.', grade: 'middle1' },
  { id: 'm1_099', korean: '저는 세계를 여행하고 싶습니다.', english: 'I want to travel the world.', grade: 'middle1' },
  { id: 'm1_100', korean: '감사합니다. 안녕히 가세요.', english: 'Thank you. Goodbye.', grade: 'middle1' }
];

const middle2Sentences: Omit<Sentence, 'isImportant' | 'studyCount' | 'lastStudied'>[] = Array.from({ length: 100 }, (_, i) => {
  const sentences = [
    { korean: '저는 어제 영화를 봤습니다.', english: 'I watched a movie yesterday.' },
    { korean: '내일 친구를 만날 예정입니다.', english: 'I will meet my friend tomorrow.' },
    { korean: '지금 숙제를 하고 있습니다.', english: 'I am doing homework now.' },
    { korean: '저는 피자를 좋아합니다.', english: 'I like pizza.' },
    { korean: '그는 축구를 잘 합니다.', english: 'He plays soccer well.' },
    { korean: '그녀는 노래를 부르고 있습니다.', english: 'She is singing a song.' },
    { korean: '우리는 공원에서 놀았습니다.', english: 'We played in the park.' },
    { korean: '그들은 도서관에서 공부합니다.', english: 'They study in the library.' },
    { korean: '저는 매일 운동을 합니다.', english: 'I exercise every day.' },
    { korean: '그는 일찍 일어납니다.', english: 'He gets up early.' },
    { korean: '저는 늦게 잠들었습니다.', english: 'I went to bed late.' },
    { korean: '그녀는 빨리 달릴 수 있습니다.', english: 'She can run fast.' },
    { korean: '우리는 함께 점심을 먹었습니다.', english: 'We had lunch together.' },
    { korean: '저는 새로운 친구를 사귀었습니다.', english: 'I made a new friend.' },
    { korean: '그는 기타를 연주할 수 있습니다.', english: 'He can play the guitar.' },
    { korean: '저는 수학 시험을 잘 봤습니다.', english: 'I did well on the math test.' },
    { korean: '그녀는 그림을 그리는 것을 좋아합니다.', english: 'She likes drawing pictures.' },
    { korean: '우리는 박물관을 방문했습니다.', english: 'We visited the museum.' },
    { korean: '저는 새로운 책을 읽고 있습니다.', english: 'I am reading a new book.' },
    { korean: '그는 컴퓨터 게임을 좋아합니다.', english: 'He likes computer games.' },
    { korean: '저는 주말에 쇼핑을 갔습니다.', english: 'I went shopping on the weekend.' },
    { korean: '그녀는 피아노를 배우고 있습니다.', english: 'She is learning to play the piano.' },
    { korean: '우리는 캠핑을 갔습니다.', english: 'We went camping.' },
    { korean: '저는 요리하는 것을 좋아합니다.', english: 'I like cooking.' },
    { korean: '그는 농구 선수가 되고 싶어합니다.', english: 'He wants to become a basketball player.' },
    { korean: '저는 외국어를 배우고 있습니다.', english: 'I am learning a foreign language.' },
    { korean: '그녀는 춤을 잘 춥니다.', english: 'She dances well.' },
    { korean: '우리는 해변에서 놀았습니다.', english: 'We played at the beach.' },
    { korean: '저는 일기를 쓰고 있습니다.', english: 'I am writing a diary.' },
    { korean: '그는 사진 찍는 것을 좋아합니다.', english: 'He likes taking photos.' }
  ];
  
  const sentence = sentences[i % sentences.length];
  return {
    id: `m2_${String(i + 1).padStart(3, '0')}`,
    korean: sentence.korean,
    english: sentence.english,
    grade: 'middle2' as Grade
  };
});

const middle3Sentences: Omit<Sentence, 'isImportant' | 'studyCount' | 'lastStudied'>[] = Array.from({ length: 100 }, (_, i) => {
  const sentences = [
    { korean: '저는 3년 동안 영어를 공부했습니다.', english: 'I have studied English for 3 years.' },
    { korean: '만약 비가 오면 집에 있을 거예요.', english: 'If it rains, I will stay home.' },
    { korean: '그녀는 노래를 부르는 것을 좋아합니다.', english: 'She likes singing songs.' },
    { korean: '저는 환경 보호에 관심이 많습니다.', english: 'I am very interested in environmental protection.' },
    { korean: '그는 의사가 되고 싶어합니다.', english: 'He wants to become a doctor.' },
    { korean: '우리는 지구 온난화에 대해 걱정합니다.', english: 'We are worried about global warming.' },
    { korean: '저는 봉사활동을 하고 있습니다.', english: 'I am doing volunteer work.' },
    { korean: '그녀는 외국어를 배우고 있습니다.', english: 'She is learning foreign languages.' },
    { korean: '우리는 문화 축제에 참가했습니다.', english: 'We participated in the cultural festival.' },
    { korean: '저는 진로에 대해 고민하고 있습니다.', english: 'I am thinking about my career path.' },
    { korean: '그는 과학 실험을 좋아합니다.', english: 'He likes science experiments.' },
    { korean: '저는 역사에 대해 배우고 있습니다.', english: 'I am learning about history.' },
    { korean: '그녀는 창의적인 글쓰기를 합니다.', english: 'She does creative writing.' },
    { korean: '우리는 팀워크의 중요성을 배웠습니다.', english: 'We learned the importance of teamwork.' },
    { korean: '저는 리더십을 기르고 있습니다.', english: 'I am developing leadership skills.' },
    { korean: '기술의 발전이 우리 삶을 바꾸고 있습니다.', english: 'Technological advancement is changing our lives.' },
    { korean: '저는 미래에 대해 계획을 세우고 있습니다.', english: 'I am making plans for the future.' },
    { korean: '그는 다양한 문화를 경험하고 싶어합니다.', english: 'He wants to experience various cultures.' },
    { korean: '우리는 사회 문제에 관심을 가져야 합니다.', english: 'We should be interested in social issues.' },
    { korean: '저는 독립적인 사고를 기르고 있습니다.', english: 'I am developing independent thinking.' },
    { korean: '그녀는 예술적 재능이 있습니다.', english: 'She has artistic talent.' },
    { korean: '우리는 글로벌 시민이 되어야 합니다.', english: 'We should become global citizens.' },
    { korean: '저는 비판적 사고를 배우고 있습니다.', english: 'I am learning critical thinking.' },
    { korean: '그는 창업에 관심이 있습니다.', english: 'He is interested in starting a business.' },
    { korean: '우리는 지속 가능한 발전을 추구해야 합니다.', english: 'We should pursue sustainable development.' },
    { korean: '저는 다양한 관점을 이해하려고 노력합니다.', english: 'I try to understand various perspectives.' },
    { korean: '그녀는 사회 봉사에 적극적입니다.', english: 'She is active in community service.' },
    { korean: '우리는 문화적 다양성을 존중해야 합니다.', english: 'We should respect cultural diversity.' },
    { korean: '저는 평생 학습의 중요성을 깨달았습니다.', english: 'I realized the importance of lifelong learning.' },
    { korean: '그는 혁신적인 아이디어를 가지고 있습니다.', english: 'He has innovative ideas.' }
  ];
  
  const sentence = sentences[i % sentences.length];
  return {
    id: `m3_${String(i + 1).padStart(3, '0')}`,
    korean: sentence.korean,
    english: sentence.english,
    grade: 'middle3' as Grade
  };
});

const high1Sentences: Omit<Sentence, 'isImportant' | 'studyCount' | 'lastStudied'>[] = Array.from({ length: 100 }, (_, i) => {
  const sentences = [
    { korean: '환경 보호는 매우 중요합니다.', english: 'Environmental protection is very important.' },
    { korean: '기술의 발전은 우리 삶을 변화시켰습니다.', english: 'The advancement of technology has changed our lives.' },
    { korean: '문학은 인간의 감정과 경험을 표현하는 예술입니다.', english: 'Literature is an art that expresses human emotions and experiences.' },
    { korean: '교육은 사회 발전의 기초입니다.', english: 'Education is the foundation of social development.' },
    { korean: '과학은 인류의 미래를 밝게 합니다.', english: 'Science brightens the future of humanity.' },
    { korean: '예술은 문화의 꽃입니다.', english: 'Art is the flower of culture.' },
    { korean: '역사를 통해 우리는 교훈을 얻습니다.', english: 'We learn lessons through history.' },
    { korean: '철학은 삶의 의미를 탐구합니다.', english: 'Philosophy explores the meaning of life.' },
    { korean: '경제는 사회의 기반입니다.', english: 'Economy is the foundation of society.' },
    { korean: '정치는 국민의 의지를 반영해야 합니다.', english: 'Politics should reflect the will of the people.' },
    { korean: '민주주의는 시민의 참여를 필요로 합니다.', english: 'Democracy requires citizen participation.' },
    { korean: '인권은 모든 인간의 기본적 권리입니다.', english: 'Human rights are fundamental rights of all humans.' },
    { korean: '평등은 사회 정의의 핵심입니다.', english: 'Equality is the core of social justice.' },
    { korean: '자유는 책임을 동반합니다.', english: 'Freedom comes with responsibility.' },
    { korean: '다양성은 사회를 풍요롭게 만듭니다.', english: 'Diversity enriches society.' },
    { korean: '창의성은 혁신의 원동력입니다.', english: 'Creativity is the driving force of innovation.' },
    { korean: '소통은 갈등 해결의 열쇠입니다.', english: 'Communication is the key to conflict resolution.' },
    { korean: '협력은 공동의 목표 달성을 가능하게 합니다.', english: 'Cooperation enables the achievement of common goals.' },
    { korean: '관용은 평화로운 공존의 기초입니다.', english: 'Tolerance is the foundation of peaceful coexistence.' },
    { korean: '지식은 힘이며 책임입니다.', english: 'Knowledge is power and responsibility.' },
    { korean: '문화는 인류의 공통 유산입니다.', english: 'Culture is the common heritage of humanity.' },
    { korean: '언어는 사고와 문화를 담는 그릇입니다.', english: 'Language is a vessel that contains thought and culture.' },
    { korean: '전통과 현대의 조화가 중요합니다.', english: 'The harmony between tradition and modernity is important.' },
    { korean: '개인의 성장은 사회 발전으로 이어집니다.', english: 'Individual growth leads to social development.' },
    { korean: '도덕적 가치관이 행동의 기준이 됩니다.', english: 'Moral values become the standard for behavior.' },
    { korean: '비판적 사고는 올바른 판단의 기초입니다.', english: 'Critical thinking is the foundation of sound judgment.' },
    { korean: '상상력은 현실을 뛰어넘는 힘입니다.', english: 'Imagination is the power to transcend reality.' },
    { korean: '도전 정신은 발전의 원동력입니다.', english: 'The spirit of challenge is the driving force of progress.' },
    { korean: '인내는 성공의 필수 요소입니다.', english: 'Patience is an essential element of success.' },
    { korean: '겸손은 지혜의 시작입니다.', english: 'Humility is the beginning of wisdom.' }
  ];
  
  const sentence = sentences[i % sentences.length];
  return {
    id: `h1_${String(i + 1).padStart(3, '0')}`,
    korean: sentence.korean,
    english: sentence.english,
    grade: 'high1' as Grade
  };
});

const high2Sentences: Omit<Sentence, 'isImportant' | 'studyCount' | 'lastStudied'>[] = Array.from({ length: 100 }, (_, i) => {
  const sentences = [
    { korean: '글로벌화는 세계를 더 가깝게 만들었습니다.', english: 'Globalization has made the world closer.' },
    { korean: '고전 문학은 시대를 초월한 보편적 가치를 담고 있습니다.', english: 'Classical literature contains universal values that transcend time.' },
    { korean: '인공지능은 미래 사회를 변화시킬 것입니다.', english: 'Artificial intelligence will transform future society.' },
    { korean: '민주주의는 시민의 참여를 필요로 합니다.', english: 'Democracy requires citizen participation.' },
    { korean: '문화 다양성은 사회를 풍요롭게 합니다.', english: 'Cultural diversity enriches society.' },
    { korean: '지속 가능한 발전이 중요합니다.', english: 'Sustainable development is important.' },
    { korean: '창의성은 혁신의 원동력입니다.', english: 'Creativity is the driving force of innovation.' },
    { korean: '소통은 인간관계의 핵심입니다.', english: 'Communication is the core of human relationships.' },
    { korean: '디지털 혁명이 사회 구조를 바꾸고 있습니다.', english: 'The digital revolution is changing social structures.' },
    { korean: '빅데이터는 새로운 가치를 창출합니다.', english: 'Big data creates new value.' },
    { korean: '사물인터넷이 일상을 변화시키고 있습니다.', english: 'The Internet of Things is changing daily life.' },
    { korean: '가상현실 기술이 교육을 혁신하고 있습니다.', english: 'Virtual reality technology is revolutionizing education.' },
    { korean: '블록체인은 신뢰의 새로운 패러다임입니다.', english: 'Blockchain is a new paradigm of trust.' },
    { korean: '로봇 기술이 산업을 자동화하고 있습니다.', english: 'Robot technology is automating industries.' },
    { korean: '바이오 기술이 의학을 발전시키고 있습니다.', english: 'Biotechnology is advancing medicine.' },
    { korean: '나노 기술이 새로운 가능성을 열고 있습니다.', english: 'Nanotechnology is opening new possibilities.' },
    { korean: '재생 에너지가 환경 문제의 해답입니다.', english: 'Renewable energy is the answer to environmental problems.' },
    { korean: '우주 탐사가 인류의 지평을 넓히고 있습니다.', english: 'Space exploration is expanding human horizons.' },
    { korean: '유전자 치료가 불치병 치료의 희망입니다.', english: 'Gene therapy is hope for treating incurable diseases.' },
    { korean: '양자 컴퓨팅이 계산의 한계를 뛰어넘습니다.', english: 'Quantum computing transcends the limits of computation.' },
    { korean: '3D 프린팅이 제조업을 혁신하고 있습니다.', english: '3D printing is revolutionizing manufacturing.' },
    { korean: '자율주행차가 교통의 미래를 바꿀 것입니다.', english: 'Autonomous vehicles will change the future of transportation.' },
    { korean: '스마트시티가 도시 문제의 해결책입니다.', english: 'Smart cities are the solution to urban problems.' },
    { korean: '핀테크가 금융 서비스를 혁신하고 있습니다.', english: 'Fintech is innovating financial services.' },
    { korean: '에듀테크가 교육의 접근성을 높이고 있습니다.', english: 'Edutech is increasing accessibility to education.' },
    { korean: '헬스케어 기술이 의료 서비스를 개선하고 있습니다.', english: 'Healthcare technology is improving medical services.' },
    { korean: '클라우드 컴퓨팅이 데이터 저장을 혁신했습니다.', english: 'Cloud computing has revolutionized data storage.' },
    { korean: '사이버 보안이 디지털 시대의 필수 요소입니다.', english: 'Cybersecurity is an essential element of the digital age.' },
    { korean: '머신러닝이 데이터 분석을 자동화하고 있습니다.', english: 'Machine learning is automating data analysis.' },
    { korean: '증강현실이 현실과 가상을 융합하고 있습니다.', english: 'Augmented reality is merging reality and virtual worlds.' }
  ];
  
  const sentence = sentences[i % sentences.length];
  return {
    id: `h2_${String(i + 1).padStart(3, '0')}`,
    korean: sentence.korean,
    english: sentence.english,
    grade: 'high2' as Grade
  };
});

const high3Sentences: Omit<Sentence, 'isImportant' | 'studyCount' | 'lastStudied'>[] = Array.from({ length: 100 }, (_, i) => {
  const sentences = [
    { korean: '지속 가능한 발전이 미래의 핵심입니다.', english: 'Sustainable development is the key to the future.' },
    { korean: '대학 입시는 인생의 중요한 전환점입니다.', english: 'College entrance exams are an important turning point in life.' },
    { korean: '진로 선택은 신중하게 해야 합니다.', english: 'Career choices should be made carefully.' },
    { korean: '자기 계발은 평생의 과제입니다.', english: 'Self-development is a lifelong task.' },
    { korean: '사회적 책임을 다해야 합니다.', english: 'We must fulfill our social responsibilities.' },
    { korean: '미래에 대한 비전이 중요합니다.', english: 'Having a vision for the future is important.' },
    { korean: '도전 정신이 성공의 열쇠입니다.', english: 'The spirit of challenge is the key to success.' },
    { korean: '비판적 사고력을 기르는 것이 중요합니다.', english: 'It is important to develop critical thinking skills.' },
    { korean: '창의적 문제 해결 능력이 필요합니다.', english: 'Creative problem-solving skills are needed.' },
    { korean: '글로벌 시대에 맞는 인재가 되어야 합니다.', english: 'We must become talents suited for the global era.' },
    { korean: '다문화 사회에 대한 이해가 필요합니다.', english: 'Understanding of multicultural society is necessary.' },
    { korean: '정보화 시대의 디지털 리터러시가 중요합니다.', english: 'Digital literacy in the information age is important.' },
    { korean: '윤리적 가치관을 확립해야 합니다.', english: 'We must establish ethical values.' },
    { korean: '인문학적 소양을 기르는 것이 필요합니다.', english: 'It is necessary to cultivate humanistic literacy.' },
    { korean: '과학적 사고방식을 익혀야 합니다.', english: 'We must learn scientific thinking methods.' },
    { korean: '예술적 감성을 기르는 것이 중요합니다.', english: 'It is important to cultivate artistic sensibility.' },
    { korean: '체계적인 학습 계획이 필요합니다.', english: 'A systematic learning plan is necessary.' },
    { korean: '자기주도적 학습 능력을 기르세요.', english: 'Develop self-directed learning abilities.' },
    { korean: '협력적 문제 해결 능력이 중요합니다.', english: 'Collaborative problem-solving skills are important.' },
    { korean: '의사소통 능력을 향상시켜야 합니다.', english: 'We must improve communication skills.' }
  ];
  
  const sentence = sentences[i % sentences.length];
  return {
    id: `h3_${String(i + 1).padStart(3, '0')}`,
    korean: sentence.korean,
    english: sentence.english,
    grade: 'high3' as Grade
  };
});

// Export all sentence data
export const sentenceData: Record<Grade, Omit<Sentence, 'isImportant' | 'studyCount' | 'lastStudied'>[]> = {
  middle1: middle1Sentences,
  middle2: middle2Sentences,
  middle3: middle3Sentences,
  high1: high1Sentences,
  high2: high2Sentences,
  high3: high3Sentences
};

// Helper function to create full sentence objects with default values
export function createSentence(baseSentence: Omit<Sentence, 'isImportant' | 'studyCount' | 'lastStudied'>): Sentence {
  return {
    ...baseSentence,
    isImportant: false,
    studyCount: 0,
    lastStudied: undefined
  };
}

// Type guard function to validate sentence data
export function isSentence(obj: any): obj is Sentence {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.korean === 'string' &&
    typeof obj.english === 'string' &&
    typeof obj.grade === 'string' &&
    ['middle1', 'middle2', 'middle3', 'high1', 'high2', 'high3'].includes(obj.grade) &&
    typeof obj.isImportant === 'boolean' &&
    typeof obj.studyCount === 'number' &&
    (obj.lastStudied === undefined || obj.lastStudied instanceof Date)
  );
}

// Type guard function to validate grade
export function isValidGrade(grade: string): grade is Grade {
  return ['middle1', 'middle2', 'middle3', 'high1', 'high2', 'high3'].includes(grade);
}

// Data validation function
export function validateSentenceData(): boolean {
  try {
    for (const [grade, sentences] of Object.entries(sentenceData)) {
      if (!isValidGrade(grade)) {
        console.error(`Invalid grade: ${grade}`);
        return false;
      }
      
      if (!Array.isArray(sentences) || sentences.length !== 100) {
        console.error(`Grade ${grade} should have exactly 100 sentences, but has ${sentences.length}`);
        return false;
      }
      
      for (const sentence of sentences) {
        const fullSentence = createSentence(sentence);
        if (!isSentence(fullSentence)) {
          console.error(`Invalid sentence data for ${sentence.id}`);
          return false;
        }
      }
    }
    return true;
  } catch (error) {
    console.error('Error validating sentence data:', error);
    return false;
  }
}