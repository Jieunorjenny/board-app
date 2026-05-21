'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function EditPost() {
  const router = useRouter()
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPost()
  }, [id])

  async function loadPost() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()
    if (!error && data) {
      setTitle(data.title)
      setContent(data.content || '')
    }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase
      .from('posts')
      .update({ title, content })
      .eq('id', id)
    setSaving(false)
    if (error) alert('수정 실패: ' + error.message)
    else router.push(`/post/${id}`)
  }

  if (loading) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <p className="text-gray-500">불러오는 중...</p>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">글 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border rounded p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full border rounded p-2 h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
          <a href={`/post/${id}`} className="px-4 py-2 rounded border">취소</a>
        </div>
      </form>
    </main>
  )
}
