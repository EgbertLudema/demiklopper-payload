'use client'

import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'

import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'

import { FaInstagram } from 'react-icons/fa6'
import { FiMapPin } from 'react-icons/fi'
import { LuSendHorizontal } from 'react-icons/lu'

export type FormBlockType = {
  blockName?: string
  formTitle?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: SerializedEditorState
  enableInfo?: boolean
  infoBlock?: {
    content?: SerializedEditorState
    location?: string
    instagram?: string
  }
}

export const FormBlock: React.FC<
  {
    id?: string
  } & FormBlockType
> = (props) => {
  const {
    enableIntro,
    formTitle,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
    enableInfo,
    infoBlock,
  } = props

  const formMethods = useForm({
    defaultValues: formFromProps.fields,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        loadingTimerID = setTimeout(() => setIsLoading(true), 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()
          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)
            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })
            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect
            if (url) router.push(url)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({ message: 'Something went wrong.' })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  return (
    <div className="-my-16 bg-gradient-to-b from-white to-sky-100">
      <section className="container px-6 py-16">
        {enableIntro && introContent && !hasSubmitted && (
          <div className="mb-8 max-w-3xl">
            <RichText data={introContent} enableGutter={false} />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info Block */}
          {enableInfo && infoBlock && (
            <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm">
              {infoBlock.content && (
                <div className="mb-4 text-neutral-800">
                  <RichText data={infoBlock.content} enableGutter={false} />
                </div>
              )}
              {infoBlock.location && (
                <div className="flex flex-row items-center mb-4 gap-2">
                  <FiMapPin className="w-12 h-12 p-3 bg-sky-50 text-sky-600 rounded-full" />
                  <p className="text-neutral-800">{infoBlock.location}</p>
                </div>
              )}
              {infoBlock.instagram && (
                <div className="flex flex-row items-center mb-4 gap-2">
                  <FaInstagram className="w-12 h-12 p-3 bg-sky-50 text-sky-600 rounded-full" />
                  <a
                    href={infoBlock.instagram}
                    target="_blank"
                    className="text-neutral-800 underline hover:text-sky-600 transition-colors"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    {infoBlock.instagram.replace('https://www.instagram.com/', '').replace('/', '')}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            {formTitle && <h3 className="text-xl font-semibold mb-6">{formTitle}</h3>}
            <FormProvider {...formMethods}>
              {!isLoading && hasSubmitted && confirmationType === 'message' && (
                <RichText data={confirmationMessage} />
              )}
              {isLoading && !hasSubmitted && <p>Aan het laden...</p>}
              {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
              {!hasSubmitted && (
                <form id={formID} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {formFromProps?.fields?.map((field, index) => {
                    const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                    if (Field) {
                      return (
                        <div className="mb-4" key={index}>
                          <Field
                            form={formFromProps}
                            {...field}
                            {...formMethods}
                            control={control}
                            errors={errors}
                            register={register}
                          />
                        </div>
                      )
                    }
                    return null
                  })}

                  <button
                    className="flex flex-row items-center gap-2 bg-sky-400 text-white px-4 py-2 rounded hover:opacity-80 cursor-pointer transition"
                    type="submit"
                  >
                    {submitButtonLabel || 'Versturen'}
                    <LuSendHorizontal />
                  </button>
                </form>
              )}
            </FormProvider>
          </div>
        </div>
      </section>
    </div>
  )
}
