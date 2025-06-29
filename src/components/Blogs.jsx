import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
const backendBaseUrl = "https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/"; 
const BlogsContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  max-height: 500vh;
`;

const Title = styled.h2`
  font-size:m, 2rem;
  margin-bottom: 1rem;
  color: #333;
`;

const BlogForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin-bottom: 2rem;
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const FileInput = styled.input`
  margin-bottom: 1rem;
`;

const SubmitButton = styled.button`
  background-color: #2196f3;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
`;

const BlogCard = styled.div`
  width: 100%;
  max-width: 1500px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #f7f7f7;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
`;

const BlogTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const BlogContent = styled.div`
  font-size: 1.2rem;
  line-height: 1.6;
  color: #666;

  img,
  video {
    max-width: 100%;
    margin-bottom: 1rem;
  }

  a {
    color: #2196f3;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const BlogContentItem = styled.div`
  margin: 1rem 0;
  display: flex;
  align-items: center;
`;

const ContentTypeSelect = styled.select`
  margin-right: 1rem;
`;

const ContentDataInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const AddContentButton = styled.button`
  background-color: #2196f3;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
`;

const EditButton = styled.button`
  background-color: #ffc107;
  color: black;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
`;

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [contentSections, setContentSections] = useState([]);
  const [link, setLink] = useState('');
  const [fileInput, setFileInput] = useState([]);
  const [editingBlogId, setEditingBlogId] = useState(null);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('https://portfolio-api-30april.onrender.com/api/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('link', link);

      // Serialize contentSections as JSON
      formData.append('content', JSON.stringify(contentSections));

      for (let i = 0; i < fileInput.length; i++) {
        formData.append('files', fileInput[i]);
      }

      if (editingBlogId) {
        await axios.put(`/api/blogs/${editingBlogId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setEditingBlogId(null);
      } else {
        await axios.post('https://portfolio-api-30april.onrender.com/api/blogs', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setTitle('');
      setContentSections([]);
      setLink('');
      setFileInput([]);
      fetchBlogs();
    } catch (error) {
      console.error('Error submitting blog:', error);
    }
  };
  const handleAddContentSection = (type) => {
    if (contentSections.length === 0) {
      setContentSections([{ type: 'text', data: '', url: '' }]);
    } else {
      const newSection = { type, data: '', url: '' };
  
      if (type === 'image' || type === 'video') {
        newSection.url = '';
      }
  
      setContentSections([...contentSections, newSection]);
    }
  };
  

  const handleRemoveContentSection = (index) => {
    const updatedContentSections = [...contentSections];
    updatedContentSections.splice(index, 1);
    setContentSections(updatedContentSections);
  };

  const handleUpdateContentData = (index, data) => {
    const updatedContentSections = [...contentSections];
    updatedContentSections[index].data = data;
    setContentSections(updatedContentSections);
  };

  const handleUpdateContentFile = (index, files) => {
    const updatedContentSections = [...contentSections];
    updatedContentSections[index].url = URL.createObjectURL(files[0]);
    setFileInput((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles[index] = files[0];
      return newFiles;
    });
    setContentSections(updatedContentSections);
  };

  const handleEditBlog = (blog) => {
    setTitle(blog.title);
    setContentSections(blog.content);
    setLink(blog.link);
    setEditingBlogId(blog._id);
  };

  return (
    <BlogsContainer>
      <Title>Create or Edit a Blog</Title>
      <BlogForm onSubmit={handleSubmit}>
        <InputField
          type="text"
          placeholder="Enter blog title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
{contentSections.map((section, index) => (
  <BlogContentItem key={index}>
    <ContentTypeSelect
      value={section.type}
      onChange={(e) => {
        const updatedContentSections = [...contentSections];
        updatedContentSections[index].type = e.target.value;
        setContentSections(updatedContentSections);
      }}
    >
      <option value="text">Text</option>
      <option value="image">Image</option>
      <option value="video">Video</option>
    </ContentTypeSelect>

    {section.type !== 'image' && section.type !== 'video' && (
      <ContentDataInput
        type="text"
        placeholder="Enter text content"
        value={section.data}
        onChange={(e) => handleUpdateContentData(index, e.target.value)}
      />
    )}

    {section.type === 'image' && (
      <div>
        <FileInput
          type="file"
          accept="image/*"
          onChange={(e) => handleUpdateContentFile(index, e.target.files)}
        />
        {section.url && <img src={`https://portfolio-api-30april.onrender.com${section.url}`} alt={`Image ${index}`} />}
      </div>
    )}

    {section.type === 'video' && (
      <div>
        <FileInput
          type="file"
          accept="video/*"
          onChange={(e) => handleUpdateContentFile(index, e.target.files)}
        />
        {section.url && (
          <video width="320" height="240" controls>
            <source src={`https://portfolio-api-30april.onrender.com${section.url}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    )}
    <button onClick={() => handleRemoveContentSection(index)}>Remove</button>
  </BlogContentItem>
))}
        <AddContentButton
          type="button"
          onClick={() => handleAddContentSection('text')}
        >
          Add Text Section
        </AddContentButton>
        <AddContentButton
          type="button"
          onClick={() => handleAddContentSection('image')}
        >
          Add Image Section
        </AddContentButton>
        <AddContentButton
          type="button"
          onClick={() => handleAddContentSection('video')}
        >
          Add Video Section
        </AddContentButton>

        <InputField
          type="url"
          placeholder="Enter blog link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

<SubmitButton type="submit">
          {editingBlogId ? 'Update Blog' : 'Create Blog'}
        </SubmitButton>
      </BlogForm>

    {blogs.map((blog) => (
        <BlogCard key={blog._id}>
          <BlogTitle>{blog.title}</BlogTitle>
          <BlogContent>
            {blog.content.map((section, index) => {
              if (section.type === 'text') {
                return <p key={index}>{section.data}</p>;
              } else if (section.type === 'image') {
                return (
                  <div key={index}>
                    <img src={`${backendBaseUrl}${section.url}`} alt={`Image ${index}`} />
                  </div>
                );
              } else if (section.type === 'video') {
                return (
                  <div key={index}>
                    <video width="320" height="240" controls>
                      <source src={`${backendBaseUrl}${section.url}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                );
              }
              return null;
            })}



            {blog.link && (
              <p>
               
              </p>
            )}
          </BlogContent>
          <EditButton onClick={() => handleEditBlog(blog)}>Edit</EditButton>
        </BlogCard>
      ))}
    </BlogsContainer>
  );
};

export default Blogs;
