# Главная страница

Эскиз дизайна экспортирован из Figma и доступен в файле: .claude/home.png

## Назначение

Это страница, на которую пользователь попадает когда заходит на сайт.
Основное назначение этой страницы:

1. показать слайдшоу основных рисунков художника;
2. и предоставить пользователю краткую информацию о художнике.

## Структура

Ниже приведена структура главной страницы сверху вниз в соответствии с эскизом дизайна и содержит все видимые элементы:
<home>
<Navigation>
<ArtistLogo />
<NavButtons>
<Home />
<CurriculumVitae />
<ArtGallery/>
</NavButtons>
</Navigation>
<HeroSlideshow>
<MetadataOverlay>
<TopBottomGradientShadow />
<Size />
<Description />
<FileWeight />
<ArtTitle>
<Barcode />
<Title />
<SquaresSVG />
</ArtTitle>
</MetadataOverlay>
<Slideshow />
<ArtistBranding>
<ArtistLogo />
<BrandingText />
<SlideshowControllers />
<BottomTopGradientShadow />
</ArtistBranding>
</HeroSlideshow>
<AboutMe>
<CharacterIllustration />
<InfoCard>
<Title>
<ArtistName />
<DayOfBirth />
<Location />
<ShortSelfPresentationText />
</InfoCard>
</AboutMe>

 <Footer>
   <SocialLinks>
     <Artstation />
     <X_Twitter />
     <Telegram />
     <Youtube />
     <Discord />
     <VK />
   </SocialLinks>
   <Nav>
     <Home />
     <CurriculumVitae />
     <ArtGallery />
     <Projects />
   </Nav>
   <ScanningSVG>
   <WavedBackground>
 </Footer>
</home>

Ниже приведено описание некоторых важных элементов.

### Navigation

Общая для всех страниц панель навигации. Так что по сути не является частью главной страницы.
Но отображатся на ней на самом верху.

При прокручивании экрана перемещается вслед за скроллом.
Имеет прозрачность и эффект блюр. Выглядит как матовое серое полупрозрачное стекло.

Пример кнопки для текущей страницы:

```
[◊] HOME
```

Пример кнопки для всех остальных страниц:

```
/ ART GALLERY
```

Кнопки на этой панели имеют две анимации:

- при наведении;
- при нажатии.

#### При наведении

1. Кнопка текущей страницы меняет цвет с бирюзового на белый
2. Кнопка раздела, на который навели курсор мыши, меняет цвет с белого на бирюзовый.

#### При нажатии

1. Кнопка текущей страницы выполнят path transform для разделителя [◊] -> /
2. Кнопка раздела, на который навели курсор мыши, выполнят path transform для разделителя / -> [◊]

path transform выполняется в два шага:

1. [◊] -> |
2. | -> /

обратный path transform в обратном порядке:

1. / -> |
2. | -> [◊]

/, |, [◊] - это три SVG иконки:
/ - .claude/nav1.svg
| - .claude/nav2.svg
[◊] .claude/nav3.svg

### HeroSlideshow

Пожалуй главный элемент на страницы. Отображает слайдшоу артов.
Для плавного перехода между рисунками HeroSlideshow загружает все арты,
и помечает текущий как видимый, остальные не видны.

> Важно! Предзагруженные рисунки лежат друг под другом по оси Z и не смещены относительно друг друга по осям X и Y

Каждые 5 секунд происходит плавная смена видимого арта.

### Size

Тут текстом показано размер рисунка, который сейчас отображается.
Пример:

```
size:
6264/3554
```

Шрифт: Erbos Draco 1st Open NBP

### Description

Тут текстом выводится описание рисунка, который сейчас отображается.
Пример:

```
Description:
Comm-Illustration
```

Шрифт: Erbos Draco 1st Open NBP

### FileWeight

Тут текстом отображает размер оригинального файла рисунка, который сейчас отображается.
Пример:

```
weight:
8.3 mb
```

Шрифт: Erbos Draco 1st Open NBP

### ArtTitle

Тут текстом отображает название рисунка, который сейчас отображается.
Дизайн этого элемента имеет более сложную структуру.
Barcode - Штрихкод белым цветом
Title - название рисунка
SquaresSVG - .claude/square_svg.svg

Шрифт: Erbos Draco 1st Open NBP

### TopBottomGradientShadow

Градиент предназначенный для того, чтобы текст MetadataOverlay лучше читался:

```css
background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 40.38%, #ffffff 100%);
mix-blend-mode: multiply;
opacity: 0.7;
```

### BottomTopGradientShadow

Градиент предназначенный для того, чтобы текст ArtistBranding лучше читался:

```css
background: linear-gradient(180deg, #ffffff 0%, #000000 100%);
mix-blend-mode: multiply;
opacity: 0.7;
```

### SlideshowControllers

Кнопки управления слайдшоу. Расположены в правом нижнем углу. Имеют особый дизайн и анимацию.

Вот более подробная структура:
<SlideshowControllers>
<PrevButton />
<PlayPauseButton />
<NextButton />
</SlideshowControllers>

Все элементы расположены в одну строку в три колонки.
Вот как они выглядят:

1.  PrevButton - круг с залитым фоном, в котором сделана прорезь в виде символа <
2.  NextButton - круг с залитым фоном, в котором сделана прорезь в виде символа >
3.  PlayPauseButton - в зависимости от состояния иконка паузы или play, обведенная кругом прогрессера с анимацией. Прогрессер заполняется красным.

### CharacterIllustration

Аватар художника: .claude/avatar.png

### InfoCard

Карточка с краткой информацией о художнике. Важно обратить внимание на дизайн элементов карточки и на шрифты.
Фон карточки серый, правый нижний угол скруглен.

Сверху вниз карточка содержит:

1.  В верхней части заголовок '/About me'. Шрифт заголовка: ISL_Andvari
2.  Расположенные в две колонки: ArtistName и DayOfBirth.
    Фон заголовка каждой черный, правый нижний угол скруглен. Шрифт белый: Content
    Имя и дата рождения написаны шрифтом ISL_Andvari крупно.
    В ArtistName есть третья строка, где мелким шрифтом написан никнейм. Шрифт: Content
3.  Location - краткое текущее местоположение художника.
4.  Разделительная черта
5.  Текст с самопрезентацией художника.

ArtistName, DayOfBirth и Location могут быть реализованы одним и тем же компонентом React.

### ScanningSVG

📡 стикер .claude/footer.png

### SocialLinks

Это ссылки на социальные сети, например:
<Discord>
[{{DiscordSVG}}] Discord
</Discord>
Тут используется шрифт Erbos Draco 1st Open NBP.
При наведении курсора мыши понятная пользователю анимация, которая подсказывает, что на этот элемент можно нажать.

### Nav

Шрифт всех элементов: Erbos Draco 1st NBP
Например:

```
НОМЕ
```

При наведении курсора мыши понятная пользователю анимация, которая подсказывает, что на этот элемент можно нажать.
