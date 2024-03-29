import { postPost } from "../services/api";
import { useUserStore } from "../stores/userStore";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { usePostStore } from "../stores/postStore";
import TextareaAutosize from 'react-textarea-autosize';

function PostWrite() {
  const { user } = useUserStore();
  const { setPage } = usePostStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // post 작성 mutation
  const { mutate } = useMutation((body) => postPost(body), {
    onSettled: () => {
      queryClient.resetQueries("getPosts");
    },
    onSuccess: (data) => {
      setPage(1)
      navigate(`/posts/${data}`);
    },
  });

  // post 작성 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const content = e.target.content.value;
    const writer = user.id;

    mutate({ title, content, writer });
  };

  // 작성 취소
  const handleCancle = () => {
    if (!window.confirm("작성한 모든 내용이 사라집니다.\n정말 취소하시겠습니까?")) return;
    navigate(-1);
  };

  return (
    <section className='sec write-sec'>
      <div className='container'>
        <h2 className='title text-center'>글쓰기</h2>
        <form className='form d-flex flex-column gap-2' onSubmit={handleSubmit}>
          <input type='text' name='title' className='post-title' placeholder='제목' required></input>
          <TextareaAutosize name='content' className='post-content' placeholder='- 내용 -' required></TextareaAutosize>
          <div className='btn-wrapper d-flex justify-content-end gap-2'>
            <button type='button' className='btns cancleBtn' onClick={handleCancle}>
              취소
            </button>
            <button type='submit' className='btns submitBtn'>
              등록
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default PostWrite;
