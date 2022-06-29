# Royal Game Of Ur

Royal Game Of Ur, česky Královská hra z Uru je desková hra pro dva hráče. Datum jejího vzniku není přesně známé, ale první zmínky o ní pochází z třetího tisíciletí před naším letopočtem ze starověké Mezopotánie. Hra byla velice oblíbená po celém Blízkém východě, ale i na Srí Lance. V době největšího rozmachu získala hra spirituální přesah. Jednotlivým událostem ve hře byly připisovány schopnosti předpovídat budoucnost hráče nebo komunikaci s duchy.

Hra byla i přes svou velkou oblíbenost časem vytlačena jinými deskovými hrami a postupně byla zapomenuta. Výjimku tvořila židovská menšina v indickém městě Kochi, která hrála variantu této hry až do roku 1950, kdy většina jejích příslušníků emigrovala do Izraele. 

Své jméno hra dostala podle místa, kde byla poprvé znovuobjevena. Stalo se tak při vykopávkách v roce 1922 v královském hřbitově v Uru. Od té doby byly na Blízkém východě nalezeny mnohé další exempláře.

Podle jakých pravidel by se hru mělo hrát nebylo jasné až do roku 1980. V tomto roce byla v Britském muzeu přeložena hliněnou desku pocházející z roku 177 před naším letopočtem z Babylonu. Jelikož se ale pravidla hry měnila v průběhu času, je velice pravděpodobné, že původní pravidla hry vypadala úplně jinak.

# Pravidla

> Postupně vzniklo vícero variant základních pravidel. Tato sekce popisuje pravidla, která jsou použita v této implementaci.

## Základní popis

- Jde o hru pro dva hráče.
- Cílem je dostat všechny své kameny do cíle.

## Obsah hry

- Každý hráč má sedm kamenů.
- Každý hráč má tři čtyřstěnné kostky se dvěma barevně odlišenými vrcholy.

## Průběh kola

- Na začátku svého kola hráč hodí všemi kostkami.
- Počet označených vrcholů, které směřují vzhůru udává počet míst, o které se hráč musí posunout.
  - Posun může hráč realizovat dvěma způsoby:
    - Nasadí nový kámen a posune jej o zadaný počet míst.
    - Posune svůj kámen, který již je na herním plánu o zadaný počet míst.

## Pravidla pohybu

- Hráč se vždy musí posunout. I když jde o nevýhodný tah.
- Na jednom herním poli smí být v jedné chvíli pouze jeden kámen.
  - Pokud by v rámci posunu hráč měl kamenem skončit na jiném vlastním kameni, nemůže tento tah provést.
  - Pokud hráč skončí na kameni nepřítele, zabere jeho místo a oponent musí svůj kámen z desky odebrat.
- Hráči se na herní desce pohybují podle následujícího schématu:

![Herní schéma](http://matthewdeutsch.com/projects/game-of-ur/board.png)
Obrázek převzat z: [Matther Deutsch](http://matthewdeutsch.com/projects/game-of-ur/)

- Pole označené hvězdicí (na schématu jde o pozice D, H a N) jsou "bezpečná". Oponentův kámen na tomto poli nejde vyhodit. Zároveň hráč, který skočí na dané pole má možnost házet ještě jednou.

# Implementace

TODO
