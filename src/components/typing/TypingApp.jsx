import React, { useEffect, useState } from 'react'

function TypingApp() {
  const [inputArrayLetters, setInputArrayLetters] = useState([])
  const [inputArrayWords, setInputArrayWords] = useState([])
  const [typeArrayLetters, setTypeArrayLetters] = useState([])
  const [typeArrayWords, setTypeArrayWords] = useState([])
  const [wordIndex, setWordIndex] = useState(-1)
  const [textareaValue, setTextareaValue] = useState(`Recently, Topic has sparked an ongoing controversy, which inevitably leads to a moot question "is it advantageous or not?". Whereas it is a widely held view that x1 is highly beneficial, I will discuss controversial aspects of that throughout this essay. 
From the psychological standpoint, x1 is bound up inextricably with x2, which indicates they lead to y1. As a well-known example, a longitudinal study conducted by eminent scientists in 2014 demonstrates the relationship between y1 and y2. Consequently, my empirical evidence presented thus far supports the contention that the likelihood of y3 is correlated positively with x1. 
Within the realm of sociology, without the slightest doubt, x2 attribute to x1, in that it would come down to y1. A salient example of such attribution is y1, which is a cause for concern since it was mistaken to take y2 for granted. Had there been a paradigm shift earlier, scholars might have had the opportunity to pinpoint social problems. Hence, it is reasonable to infer the pivotal role of Topic. 
To conclude, as for myself, as the saying goes "all's well that ends well," after analyzing what elaborated above, I firmly believe that the advantages of Topic are of more significance.`)

  const handleInput = (e) => {
    setInputArrayLetters(e.target.value.split(""));
    // setInputArrayWords(e.target.value.split(" "));
    setTextareaValue(e.target.value)
  }
  const handleType = (e) => {
    const nonLinguisticKeys = [
      'Control', 'Alt', 'Shift', 'Meta', 'Tab', 'CapsLock', 
      'Escape', 'Enter', 'Backspace', 'Delete', 'Insert', 
      'Home', 'End', 'PageUp', 'PageDown', 'ArrowUp', 'ArrowDown', 
      'ArrowLeft', 'ArrowRight', 'Pause', 'PrintScreen', 'ScrollLock', 
      'NumLock', 'ContextMenu', 'F1', 'F2', 'F3', 'F4', 
      'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 
      'F11', 'F12' 
  ];
  const tmpArr = [...typeArrayLetters]
  console.log(e.key);
  // Check if the key is non-linguistic
  if (!nonLinguisticKeys.includes(e.key)) {
    
    tmpArr.push(e.key)
      setTypeArrayLetters(tmpArr)
  } else if(e.key === 'Backspace') {
    tmpArr.pop()
    setTypeArrayLetters(tmpArr)
  } else if (e.key === 'Enter'){
    tmpArr.push('</br>')
      setTypeArrayLetters(tmpArr)
  }
  }

  // useEffect(() => {
  //   if(typeArrayLetters.length && inputArrayLetters.length){
  //     const length = typeArrayLetters.length
  //     console.log(typeArrayLetters);
  //     console.log(typeArrayWords);
  //   }
  
  // }, [typeArrayLetters])
  

  return (
    <div className='p-4'>
      <textarea onChange={e=>handleInput(e)} value={textareaValue} className='w-full text-gray-300 shadow-sm' name="input" id="" cols="60" placeholder='Paste Base Text Here' />
      <p className='w-full text-wrap'>{typeArrayLetters.map((letter,i)=> {
      if(letter !== ' ' && letter !== '</br>') {
      return <span key={i} className={`${letter !== inputArrayLetters[i] ? "bg-orange-200":""}`}>
            {letter === inputArrayLetters[i] ? inputArrayLetters[i] : letter}
        </span> 
      } else if(letter === ' '){
        return <span className={`${letter !== inputArrayLetters[i] ? "bg-orange-200":""}  inline-block`}>&nbsp;</span>
      } else if(letter === '</br>'){
        return <br />

      }

      }
          
        
      )}
      <input onKeyDown={e=>handleType(e)} defaultValue="" value="" className='w-5 shadow-sm bg-slate-100' type='text' name="type" id="" cols="60" placeholder='' />
      </p>
      <div className='mt-4 flex gap-3'>
        <button onClick={()=>setTypeArrayLetters([])} className='py-1 px-4 rounded shadow border border-stone-400 bg-blue-200 '>Redo</button>
        <button onClick={()=>{
          setTypeArrayLetters([])
          setInputArrayLetters([])
          setTextareaValue("")
        }} className='py-1 px-4 rounded shadow border border-stone-400 bg-red-200 '>Clear All</button>
      </div>

    </div>
  )
}

export default TypingApp
