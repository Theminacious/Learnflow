'use client'
import React from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { z } from 'zod'
import { createCourseSchema } from '@/Validators/course'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import { Plus, Trash } from 'lucide-react'
import {motion,AnimatePresence} from 'framer-motion'

type Props = {}
type Input = z.infer<typeof createCourseSchema>

const CreateCourseForm = (props: Props) => {
  const form = useForm<Input>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: '',
      units: ['', '', ''],
    },
  })

  function onSubmit(data: Input) {
    console.log(data)
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field, fieldState }) => {
              return (
                <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row mb-4">
                  <FormLabel className="flex-[1] text-xl">Title</FormLabel>
                  <FormControl className="flex-[6]">
                    <Input
                      placeholder="Enter the main topic of the course"
                      {...field}
                      className={fieldState.error ? 'border-destructive' : ''}
                    />
                  </FormControl>
                </FormItem>
              )
            }}
          />

<AnimatePresence>
          {form.watch('units').map((unit, index) => (
           <motion.div
           key={index}
           initial={{opacity:0,height:0}} 
           animate={{opacity:1,height:"auto"}}
            exit={{opacity:0,height:0}}
            transition={{
              opacity:{duration:0.2},
              height:{duration:0.2},
            }}
            >
            
            
             <FormField
              key={index}
              control={form.control}
              name={`units.${index}`}
              render={({ field, fieldState }) => (
                <FormItem className='flex flex-col items-start w-full sm:items-center sm:flex-row mb-4'>
                  <FormLabel className="flex-[1] text-xl">Unit {index + 1}</FormLabel>
                  <FormControl className="flex-[6]">
                    <Input
                      placeholder={`Enter the topic of unit ${index + 1}`}
                      {...field}
                      className={fieldState.error ? 'border-destructive' : ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            </motion.div>
          ))}
          </AnimatePresence>

          <div className='flex items-center justify-center mt-4'>
            <Separator className='flex-[1]'/>
            <div className='mx-4 '>
            <Button variant='secondary'
            className='font-semibold '
            type='button'
            onClick={() => {
              form.setValue('units', [...form.watch('units'), ""])
            }
            }
            >
              Add Unit
              <Plus className='w-4 h-4 ml-2 text-green-500 ml-3 '/>
            </Button>
            <Button variant='secondary'
            className='font-semibold'
            type='button'
            onClick={() => {
              form.setValue('units', form.watch('units').slice(0, -1))
            }
          }
            >
              Remove Unit
              <Trash className='w-4 h-4 ml-2 text-red-500'/>
            </Button>
            </div>
            <Separator className='flex-[1]'/>

          </div>
          <Button className='w-full mt-6 '
          type='submit'
          size='lg'>
            Lets Go
          </Button>

        </form>
      </Form>
    </div>
  )
}

export default CreateCourseForm
