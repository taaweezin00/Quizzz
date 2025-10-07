import { router } from 'expo-router';
import React, { useState } from 'react';

import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
type Post = {
  id: string;
  content: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
};

export default function FeedScreen() {
  const { isPhone, isTablet, isDesktop } = useResponsive();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const post: Post = {
        id: Date.now().toString(),
        content: newPost,
        likes: 0,
        isLiked: false,
        comments: []
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <View style={[
      styles.postCard,
      isDesktop && styles.postCardDesktop,
      isTablet && styles.postCardTablet
    ]}>
      <Text style={[
        styles.postContent,
        isDesktop && styles.postContentDesktop
      ]}>
        {item.content}
      </Text>
      <View style={[
        styles.postActions,
        isDesktop && styles.postActionsDesktop
      ]}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleLike(item.id)}
        >
          <Text style={[
            styles.likeButton, 
            item.isLiked && styles.liked
          ]}>
            {item.isLiked ? '❤️' : '🤍'} {item.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/modal')}>
  <Text>💬 Comment</Text>
</TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Create Post Section */}
      <View style={[
        styles.createPostContainer,
        isDesktop && styles.createPostContainerDesktop,
        isTablet && styles.createPostContainerTablet
      ]}>
        <TextInput
          style={[
            styles.postInput,
            isDesktop && styles.postInputDesktop,
            isTablet && styles.postInputTablet
          ]}
          placeholder="What's on your mind?"
          value={newPost}
          onChangeText={setNewPost}
          multiline
          numberOfLines={isDesktop ? 4 : 3}
        />
        <TouchableOpacity 
          style={[
            styles.postButton,
            isDesktop && styles.postButtonDesktop
          ]} 
          onPress={handleCreatePost}
        >
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Posts List */}
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.postsList,
          isDesktop && styles.postsListDesktop
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  createPostContainer: {
    backgroundColor: 'white',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  createPostContainerDesktop: {
    margin: 20,
    padding: 20,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  createPostContainerTablet: {
    margin: 15,
    padding: 18,
  },
  postInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: 'white',
    textAlignVertical: 'top',
  },
  postInputDesktop: {
    padding: 16,
    fontSize: 16,
    minHeight: 100,
  },
  postInputTablet: {
    padding: 14,
    fontSize: 16,
    minHeight: 80,
  },
  postButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  postButtonDesktop: {
    padding: 15,
  },
  postButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  postsList: {
    padding: 10,
  },
  postsListDesktop: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    padding: 20,
  },
  postCard: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  postCardDesktop: {
    padding: 20,
    marginBottom: 15,
  },
  postCardTablet: {
    padding: 18,
    marginBottom: 12,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  postContentDesktop: {
    fontSize: 16,
    lineHeight: 24,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  postActionsDesktop: {
    paddingTop: 15,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
  },
  likeButton: {
    fontSize: 14,
  },
  liked: {
    color: '#FF3B30',
  },
});