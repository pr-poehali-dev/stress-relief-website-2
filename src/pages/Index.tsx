import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface DiaryEntry {
  id: string;
  date: string;
  content: string;
}

interface StressQuestion {
  id: number;
  question: string;
  options: { value: number; label: string }[];
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [diaryContent, setDiaryContent] = useState('');
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem('diary-entries');
    return saved ? JSON.parse(saved) : [];
  });

  const [stressAnswers, setStressAnswers] = useState<Record<number, number>>({});
  const [stressResult, setStressResult] = useState<number | null>(null);
  const [showStressTest, setShowStressTest] = useState(false);

  const [meditationActive, setMeditationActive] = useState<number | null>(null);
  const [meditationTime, setMeditationTime] = useState(0);
  const [meditationInterval, setMeditationInterval] = useState<NodeJS.Timeout | null>(null);

  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingScale, setBreathingScale] = useState(1);

  useEffect(() => {
    if (breathingActive) {
      const phases = [
        { phase: 'inhale' as const, duration: 4000, scale: 1.5 },
        { phase: 'hold' as const, duration: 4000, scale: 1.5 },
        { phase: 'exhale' as const, duration: 4000, scale: 1 },
      ];
      
      let currentPhaseIndex = 0;
      
      const cyclePhases = () => {
        const current = phases[currentPhaseIndex];
        setBreathingPhase(current.phase);
        setBreathingScale(current.scale);
        
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        setTimeout(cyclePhases, current.duration);
      };
      
      cyclePhases();
    }
  }, [breathingActive]);

  const stressQuestions: StressQuestion[] = [
    {
      id: 1,
      question: 'Как часто вы чувствуете напряжение или беспокойство?',
      options: [
        { value: 0, label: 'Никогда' },
        { value: 1, label: 'Редко' },
        { value: 2, label: 'Иногда' },
        { value: 3, label: 'Часто' },
        { value: 4, label: 'Постоянно' },
      ],
    },
    {
      id: 2,
      question: 'Насколько хорошо вы спите последнее время?',
      options: [
        { value: 0, label: 'Отлично' },
        { value: 1, label: 'Хорошо' },
        { value: 2, label: 'Нормально' },
        { value: 3, label: 'Плохо' },
        { value: 4, label: 'Очень плохо' },
      ],
    },
    {
      id: 3,
      question: 'Как часто вы испытываете трудности с концентрацией?',
      options: [
        { value: 0, label: 'Никогда' },
        { value: 1, label: 'Редко' },
        { value: 2, label: 'Иногда' },
        { value: 3, label: 'Часто' },
        { value: 4, label: 'Постоянно' },
      ],
    },
    {
      id: 4,
      question: 'Чувствуете ли вы усталость без видимой причины?',
      options: [
        { value: 0, label: 'Никогда' },
        { value: 1, label: 'Редко' },
        { value: 2, label: 'Иногда' },
        { value: 3, label: 'Часто' },
        { value: 4, label: 'Постоянно' },
      ],
    },
    {
      id: 5,
      question: 'Как часто вы раздражаетесь по мелочам?',
      options: [
        { value: 0, label: 'Никогда' },
        { value: 1, label: 'Редко' },
        { value: 2, label: 'Иногда' },
        { value: 3, label: 'Часто' },
        { value: 4, label: 'Постоянно' },
      ],
    },
  ];

  const calculateStressLevel = () => {
    const total = Object.values(stressAnswers).reduce((sum, val) => sum + val, 0);
    const percentage = (total / (stressQuestions.length * 4)) * 100;
    setStressResult(percentage);
    setShowStressTest(false);
    toast.success('Тест завершен! Смотрите результаты ниже.');
  };

  const getStressLevel = (percentage: number) => {
    if (percentage <= 25) return { level: 'Низкий', color: 'text-green-600', bg: 'bg-green-100', desc: 'Отличный результат! Вы хорошо справляетесь со стрессом.' };
    if (percentage <= 50) return { level: 'Умеренный', color: 'text-yellow-600', bg: 'bg-yellow-100', desc: 'Есть некоторое напряжение. Регулярные практики помогут вам.' };
    if (percentage <= 75) return { level: 'Повышенный', color: 'text-orange-600', bg: 'bg-orange-100', desc: 'Стресс влияет на вашу жизнь. Уделите время релаксации.' };
    return { level: 'Высокий', color: 'text-red-600', bg: 'bg-red-100', desc: 'Рекомендуем обратиться к специалисту и использовать техники релаксации.' };
  };

  const meditations = [
    {
      title: 'Дыхательная медитация',
      description: 'Успокойте разум через осознанное дыхание',
      duration: 600,
      icon: 'Wind',
      guide: 'Сосредоточьтесь на своем дыхании. Вдох... выдох... позвольте мыслям уплывать.',
    },
    {
      title: 'Сканирование тела',
      description: 'Снятие мышечного напряжения и релаксация',
      duration: 900,
      icon: 'User',
      guide: 'Мысленно сканируйте тело от макушки до пальцев ног, расслабляя каждую часть.',
    },
    {
      title: 'Осознанность',
      description: 'Практика присутствия в моменте',
      duration: 1200,
      icon: 'Brain',
      guide: 'Будьте здесь и сейчас. Наблюдайте за своими ощущениями без оценки.',
    },
  ];

  const exercises = [
    {
      title: 'Дыхание 4-4-4',
      description: 'Вдох 4 сек, задержка 4 сек, выдох 4 сек',
      icon: 'Wind',
      type: 'breathing',
    },
    {
      title: 'Визуализация',
      description: 'Создайте мысленный образ спокойного места',
      icon: 'Eye',
      type: 'visualization',
    },
    {
      title: 'Заземление 5-4-3-2-1',
      description: 'Техника возвращения в настоящий момент',
      icon: 'Sparkles',
      type: 'grounding',
    },
  ];

  const startMeditation = (index: number) => {
    if (meditationActive === index) {
      if (meditationInterval) clearInterval(meditationInterval);
      setMeditationActive(null);
      setMeditationTime(0);
      setMeditationInterval(null);
      toast.info('Медитация остановлена');
    } else {
      if (meditationInterval) clearInterval(meditationInterval);
      setMeditationActive(index);
      setMeditationTime(0);
      const interval = setInterval(() => {
        setMeditationTime((prev) => {
          if (prev >= meditations[index].duration) {
            clearInterval(interval);
            setMeditationActive(null);
            toast.success('Медитация завершена! Отличная работа!');
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
      setMeditationInterval(interval);
      toast.success('Медитация начата. Найдите удобное положение.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const saveDiaryEntry = () => {
    if (!diaryContent.trim()) {
      toast.error('Напишите что-нибудь перед сохранением');
      return;
    }

    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      content: diaryContent,
    };

    const updatedEntries = [newEntry, ...diaryEntries];
    setDiaryEntries(updatedEntries);
    localStorage.setItem('diary-entries', JSON.stringify(updatedEntries));
    setDiaryContent('');
    toast.success('Запись сохранена');
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = diaryEntries.filter((entry) => entry.id !== id);
    setDiaryEntries(updatedEntries);
    localStorage.setItem('diary-entries', JSON.stringify(updatedEntries));
    toast.success('Запись удалена');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
            <Icon name="Sparkles" size={48} className="text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">Стресс-карт</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Персональное пространство для управления стрессом и заботы о ментальном здоровье
          </p>
          <p className="text-sm text-muted-foreground mt-2">Автор: Юмангулов Руслан Наильевич</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 h-auto p-1 bg-white/80 backdrop-blur">
            <TabsTrigger value="home" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Home" size={18} className="mr-2" />
              Главная
            </TabsTrigger>
            <TabsTrigger value="test" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="ClipboardList" size={18} className="mr-2" />
              Тест
            </TabsTrigger>
            <TabsTrigger value="meditations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Flower2" size={18} className="mr-2" />
              Медитации
            </TabsTrigger>
            <TabsTrigger value="exercises" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Dumbbell" size={18} className="mr-2" />
              Упражнения
            </TabsTrigger>
            <TabsTrigger value="diary" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="BookOpen" size={18} className="mr-2" />
              Дневник
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-8 animate-fade-in">
            <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="text-3xl">Добро пожаловать!</CardTitle>
                <CardDescription className="text-base">
                  Начните свой путь к внутреннему спокойствию
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Стресс — естественная реакция организма, но важно научиться управлять им. Этот сайт
                  создан, чтобы помочь вам найти баланс и покой в повседневной жизни.
                </p>
                <div className="grid md:grid-cols-4 gap-4 mt-6">
                  <Button
                    onClick={() => setActiveTab('test')}
                    className="h-auto py-6 flex flex-col items-center gap-2 bg-purple-600 hover:bg-purple-700"
                  >
                    <Icon name="ClipboardList" size={32} />
                    <span className="text-base">Пройти тест</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab('meditations')}
                    className="h-auto py-6 flex flex-col items-center gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Icon name="Flower2" size={32} />
                    <span className="text-base">Медитации</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab('exercises')}
                    className="h-auto py-6 flex flex-col items-center gap-2 bg-secondary hover:bg-secondary/90"
                  >
                    <Icon name="Dumbbell" size={32} />
                    <span className="text-base">Упражнения</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab('diary')}
                    className="h-auto py-6 flex flex-col items-center gap-2 bg-accent hover:bg-accent/90"
                  >
                    <Icon name="BookOpen" size={32} />
                    <span className="text-base">Мой дневник</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover-scale transition-all">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <Icon name="Brain" size={24} className="text-primary" />
                  </div>
                  <CardTitle>Научный подход</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Все техники основаны на научных исследованиях когнитивно-поведенческой терапии
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-scale transition-all">
                <CardHeader>
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-2">
                    <Icon name="Shield" size={24} className="text-secondary" />
                  </div>
                  <CardTitle>Конфиденциальность</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Ваши записи хранятся только на вашем устройстве и никуда не передаются
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-scale transition-all">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-2">
                    <Icon name="Heart" size={24} className="text-accent" />
                  </div>
                  <CardTitle>Забота о себе</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Регулярная практика поможет вам лучше понимать свои эмоции и управлять ими
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Тест на уровень стресса</h2>
              <p className="text-muted-foreground">Ответьте на вопросы, чтобы оценить ваше состояние</p>
            </div>

            {!showStressTest && stressResult === null && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Icon name="ClipboardList" size={64} className="mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Готовы начать?</h3>
                  <p className="text-muted-foreground mb-6">
                    Тест займет всего 2 минуты и поможет определить уровень стресса
                  </p>
                  <Button onClick={() => setShowStressTest(true)} size="lg" className="bg-primary">
                    Начать тест
                  </Button>
                </CardContent>
              </Card>
            )}

            {showStressTest && (
              <Card>
                <CardHeader>
                  <CardTitle>Ответьте на вопросы</CardTitle>
                  <CardDescription>Выберите вариант, который лучше всего описывает ваше состояние</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {stressQuestions.map((q) => (
                    <div key={q.id} className="space-y-3">
                      <Label className="text-base font-medium">{q.question}</Label>
                      <RadioGroup
                        value={stressAnswers[q.id]?.toString()}
                        onValueChange={(value) => setStressAnswers({ ...stressAnswers, [q.id]: parseInt(value) })}
                      >
                        {q.options.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value.toString()} id={`q${q.id}-${option.value}`} />
                            <Label htmlFor={`q${q.id}-${option.value}`} className="cursor-pointer">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                  <Button
                    onClick={calculateStressLevel}
                    disabled={Object.keys(stressAnswers).length < stressQuestions.length}
                    className="w-full"
                    size="lg"
                  >
                    Показать результаты
                  </Button>
                </CardContent>
              </Card>
            )}

            {stressResult !== null && (
              <Card className={`border-2 ${getStressLevel(stressResult).bg}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="BarChart3" size={28} className={getStressLevel(stressResult).color} />
                    Ваш результат
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Уровень стресса</span>
                      <span className={`text-sm font-bold ${getStressLevel(stressResult).color}`}>
                        {getStressLevel(stressResult).level}
                      </span>
                    </div>
                    <Progress value={stressResult} className="h-3" />
                    <p className="text-sm text-muted-foreground mt-1">{Math.round(stressResult)}%</p>
                  </div>
                  <div className={`p-4 rounded-lg ${getStressLevel(stressResult).bg}`}>
                    <p className={`font-medium ${getStressLevel(stressResult).color}`}>
                      {getStressLevel(stressResult).desc}
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button onClick={() => setActiveTab('meditations')} className="w-full">
                      <Icon name="Flower2" size={18} className="mr-2" />
                      Попробовать медитацию
                    </Button>
                    <Button
                      onClick={() => {
                        setStressResult(null);
                        setStressAnswers({});
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Пройти тест заново
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="meditations" className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Медитации для спокойствия</h2>
              <p className="text-muted-foreground">Выберите практику для снижения стресса</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {meditations.map((meditation, idx) => (
                <Card
                  key={idx}
                  className={`hover-scale transition-all border-2 ${
                    meditationActive === idx ? 'border-primary shadow-lg' : 'hover:border-primary/50'
                  }`}
                >
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mb-4">
                      <Icon name={meditation.icon as any} size={32} className="text-primary" />
                    </div>
                    <CardTitle className="text-xl">{meditation.title}</CardTitle>
                    <CardDescription className="text-base">{meditation.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {meditationActive === idx && (
                      <div className="space-y-2">
                        <Progress value={(meditationTime / meditation.duration) * 100} className="h-2" />
                        <p className="text-sm text-center text-muted-foreground">
                          {formatTime(meditationTime)} / {formatTime(meditation.duration)}
                        </p>
                        <p className="text-sm text-center italic text-primary">{meditation.guide}</p>
                      </div>
                    )}
                    <Button
                      onClick={() => startMeditation(idx)}
                      className={`w-full ${meditationActive === idx ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90'}`}
                    >
                      {meditationActive === idx ? (
                        <>
                          <Icon name="Square" size={18} className="mr-2" />
                          Остановить
                        </>
                      ) : (
                        <>
                          <Icon name="Play" size={18} className="mr-2" />
                          Начать
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="exercises" className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Упражнения для релаксации</h2>
              <p className="text-muted-foreground">Практические техники снятия напряжения</p>
            </div>

            <Card className="border-2 border-primary/30 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="Wind" size={32} className="text-primary" />
                  Дыхательное упражнение 4-4-4
                </CardTitle>
                <CardDescription className="text-base">
                  Вдох 4 секунды → Задержка 4 секунды → Выдох 4 секунды
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center py-8">
                  <div
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary transition-all duration-4000 ease-in-out flex items-center justify-center"
                    style={{
                      transform: `scale(${breathingScale})`,
                      transition: 'transform 4s ease-in-out',
                    }}
                  >
                    <Icon name="Wind" size={48} className="text-white" />
                  </div>
                  {breathingActive && (
                    <p className="mt-6 text-2xl font-semibold text-primary">
                      {breathingPhase === 'inhale' && 'Вдох...'}
                      {breathingPhase === 'hold' && 'Задержите...'}
                      {breathingPhase === 'exhale' && 'Выдох...'}
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => setBreathingActive(!breathingActive)}
                  size="lg"
                  className={`w-full ${breathingActive ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90'}`}
                >
                  {breathingActive ? (
                    <>
                      <Icon name="Square" size={20} className="mr-2" />
                      Остановить
                    </>
                  ) : (
                    <>
                      <Icon name="Play" size={20} className="mr-2" />
                      Начать упражнение
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {exercises.slice(1).map((exercise, idx) => (
                <Card key={idx} className="hover-scale transition-all">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-2xl flex items-center justify-center mb-4">
                      <Icon name={exercise.icon as any} size={32} className="text-secondary" />
                    </div>
                    <CardTitle className="text-xl">{exercise.title}</CardTitle>
                    <CardDescription className="text-base">{exercise.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-secondary hover:bg-secondary/90">Попробовать</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="diary" className="space-y-6 animate-fade-in">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="Feather" size={28} className="text-primary" />
                  Личный дневник
                </CardTitle>
                <CardDescription>
                  Записывайте свои мысли и переживания. Это поможет лучше понять себя.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Что вы чувствуете сегодня? Запишите свои мысли..."
                  value={diaryContent}
                  onChange={(e) => setDiaryContent(e.target.value)}
                  className="min-h-[200px] text-base resize-none"
                />
                <Button onClick={saveDiaryEntry} className="w-full bg-primary hover:bg-primary/90">
                  <Icon name="Save" size={20} className="mr-2" />
                  Сохранить запись
                </Button>
              </CardContent>
            </Card>

            {diaryEntries.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Ваши записи</h3>
                {diaryEntries.map((entry) => (
                  <Card key={entry.id} className="hover-scale transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardDescription className="flex items-center gap-2">
                          <Icon name="Calendar" size={16} />
                          {entry.date}
                        </CardDescription>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEntry(entry.id)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Icon name="Trash2" size={18} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground whitespace-pre-wrap">{entry.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {diaryEntries.length === 0 && (
              <Card className="border-dashed bg-muted/20">
                <CardContent className="py-12 text-center">
                  <Icon name="FileText" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Здесь пока нет записей. Начните вести дневник!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <footer className="mt-16 text-center text-sm text-muted-foreground border-t pt-8">
          <p>© 2024 Стресс-карт. Разработано Юмангуловым Русланом Наильевичем</p>
          <p className="mt-2">Помните: этот сайт не заменяет профессиональную психологическую помощь</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
