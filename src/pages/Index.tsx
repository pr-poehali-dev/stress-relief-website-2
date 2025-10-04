import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface DiaryEntry {
  id: string;
  date: string;
  content: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [diaryContent, setDiaryContent] = useState('');
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem('diary-entries');
    return saved ? JSON.parse(saved) : [];
  });

  const meditations = [
    {
      title: 'Дыхательная медитация',
      description: 'Успокойте разум через осознанное дыхание',
      duration: '10 минут',
      icon: 'Wind'
    },
    {
      title: 'Сканирование тела',
      description: 'Снятие мышечного напряжения и релаксация',
      duration: '15 минут',
      icon: 'User'
    },
    {
      title: 'Осознанность',
      description: 'Практика присутствия в моменте',
      duration: '20 минут',
      icon: 'Brain'
    }
  ];

  const exercises = [
    {
      title: 'Прогрессивная релаксация',
      description: 'Последовательное расслабление групп мышц',
      icon: 'Activity'
    },
    {
      title: 'Визуализация',
      description: 'Создайте мысленный образ спокойного места',
      icon: 'Eye'
    },
    {
      title: 'Заземление 5-4-3-2-1',
      description: 'Техника возвращения в настоящий момент',
      icon: 'Sparkles'
    }
  ];

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
        minute: '2-digit'
      }),
      content: diaryContent
    };

    const updatedEntries = [newEntry, ...diaryEntries];
    setDiaryEntries(updatedEntries);
    localStorage.setItem('diary-entries', JSON.stringify(updatedEntries));
    setDiaryContent('');
    toast.success('Запись сохранена');
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = diaryEntries.filter(entry => entry.id !== id);
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
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Стресс-карт
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Персональное пространство для управления стрессом и заботы о ментальном здоровье
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Автор: Юмангулов Руслан Наильевич
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 h-auto p-1 bg-white/80 backdrop-blur">
            <TabsTrigger value="home" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Home" size={18} className="mr-2" />
              Главная
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
                  Стресс — естественная реакция организма, но важно научиться управлять им. 
                  Этот сайт создан, чтобы помочь вам найти баланс и покой в повседневной жизни.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
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

          <TabsContent value="meditations" className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Медитации для спокойствия</h2>
              <p className="text-muted-foreground">Выберите практику для снижения стресса</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {meditations.map((meditation, idx) => (
                <Card key={idx} className="hover-scale transition-all border-2 hover:border-primary/50">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mb-4">
                      <Icon name={meditation.icon as any} size={32} className="text-primary" />
                    </div>
                    <CardTitle className="text-xl">{meditation.title}</CardTitle>
                    <CardDescription className="text-base">{meditation.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Icon name="Clock" size={16} />
                        {meditation.duration}
                      </span>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Начать
                      </Button>
                    </div>
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
            <div className="grid md:grid-cols-3 gap-6">
              {exercises.map((exercise, idx) => (
                <Card key={idx} className="hover-scale transition-all">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-2xl flex items-center justify-center mb-4">
                      <Icon name={exercise.icon as any} size={32} className="text-secondary" />
                    </div>
                    <CardTitle className="text-xl">{exercise.title}</CardTitle>
                    <CardDescription className="text-base">{exercise.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-secondary hover:bg-secondary/90">
                      Попробовать
                    </Button>
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
