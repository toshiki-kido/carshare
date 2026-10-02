function estimateStay(point){
 const name=point?.name||'',kind=point?.kind||'',text=name+' '+kind;
 const rules=[[/水族館|動物園|aquarium|zoo/i,180,'水族館・動物園として'],[/遊園地|テーマパーク|amusement|theme_park/i,300,'テーマパークとして'],[/スキー|ski|ski_resort/i,240,'スキー場として'],[/空港|airport|aerodrome/i,60,'空港での送迎・用事として'],[/温泉|銭湯|spa|public_bath/i,120,'温泉・入浴施設として'],[/美術館|博物館|museum|gallery/i,120,'博物館・美術館として'],[/ショッピング|アウトレット|イオン|mall|department_store/i,120,'買い物施設として'],[/レストラン|カフェ|食堂|restaurant|cafe/i,60,'食事・カフェとして'],[/公園|庭園|park|garden/i,90,'公園・庭園として'],[/sightseeing|観光|小樽運河/i,180,'街歩き・観光として'],[/駅|station|halt/i,30,'駅での送迎・用事として']];
 for(const [pattern,minutes,reason]of rules)if(pattern.test(text))return {minutes,reason};
 return {minutes:120,reason:'目的地の種類を特定できないため、仮に'};
}
