```mermaid                                                                                                                                                        
graph TB                                                                                                                                                       
    Start[Начало игры] --> Setup[Настройка игры]                                                                                                               
    Setup --> |Каждый игрок выбирает 4 юнита| SelectUnits[Выбор армии]                                                                                         
    SelectUnits --> DrawBag[Фишки помещаются в мешок]                                                                                                          
    DrawBag --> DrawHand[Каждый игрок тянет 3 фишки]
    DrawHand --> Turn[Ход игрока]     
    Turn --> Action{Выбор действия}                                                                                                                            
                                                                                                                                                                 
    Action --> |1| Recruit[Призыв: взять фишку из запаса]                                                                                                      
    Action --> |2| Deploy[Размещение: поставить юнита на доску]                                                                                                
    Action --> |3| Move[Перемещение: сдвинуть юнита]                                                                                                           
    Action --> |4| Attack[Атака: атаковать врага]                                                                                                              
    Action --> |5| Control[Контроль: захватить точку]                                                                                                          
    Action --> |6| Tactic[Тактика: использовать способность]                                                                                                   
    Action --> |7| Pass[Пас: сбросить фишку]                                                                                                                   
    Action --> |8| Initiative[Инициатива: получить право первого хода]                                                                                         
                                                                                                                                                                 
    Recruit --> Discard[Сброс фишки]                                                                                                                           
    Deploy --> Discard                                                                                                                                         
    Move --> Discard                                                                                                                                           
    Attack --> Discard                                                                                                                                         
    Control --> Discard
    Tactic --> Discard                                                                                                                                                           
    Pass --> Discard                                                                                                                                                             
    Initiative --> Discard
    Discard --> CheckHand{Есть фишки?}                                                                                                                                           
    CheckHand --> |Да| Turn                                                                                                                                                      
    CheckHand --> |Нет| EndRound[Конец раунда]
    EndRound --> CheckVictory{Проверка победы}

    CheckVictory --> |6+ точек захвачено| Victory[Победа!]                                                                                                     
    CheckVictory --> |Все фишки врага захвачены| Victory                                                                                                       
    CheckVictory --> |Нет| NewRound[Новый раунд]                                                                                                               
                                                                                                                                                                 
    NewRound --> RefillBag[Возврат сброшенных фишек в мешок]                                                                                                   
    RefillBag --> DrawHand                                                                                                                                     
                                                                                                                                                                 
    Victory --> End[Конец игры]
```