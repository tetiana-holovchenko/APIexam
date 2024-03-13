
import { faker } from '@faker-js/faker'


const post = {
  id: faker.datatype.number({ min: 10, max: 100 }),
};

const user = {
  id: faker.datatype.number({ min: 10, max: 100 }),
  email: faker.internet.email(),
  password: faker.internet.password(),
};


describe('API tests', () => {
  let postId
    it('1. Get all posts. Verify HTTP response status code and content type. ', () => {
      cy.request('GET', '/posts').then ( response => {
        expect (response.status).to.be.equal(200);
        expect(response.headers['content-type']).to.include('application/json');
 });
});


it('2. Get only first 10 posts. Verify HTTP response status code. Verify that only first posts are returned.', () => {
  cy.request('GET', '/posts').then(response => {
    expect(response.status).to.be.equal(200);
    
    const posts = response.body;

    expect(posts.slice(0, 10)).to.have.lengthOf.at.most(10);
  });
});


it('3. Get posts with id = 55 and id = 60. Verify HTTP response status code. Verify id values of returned records.', () => {
  let ids = [55, 60];
  let jointId = ids.map(id => `id=${id}`).join('&');

  cy.request('GET', `/posts?${jointId}`).then(response => {
    expect(response.status).to.be.equal(200);

    let posts = response.body;
    posts.forEach((post) => {
      expect(ids).to.include(post.id);
    });
  });
});


it('4. Create a post. Verify HTTP response status code.', () => {
    const postData = {
      title: "It's a new post",
      body: "It's body of this new post"
    };
  
    cy.request({
      method: 'POST',
      url: '/664/posts',
      body: postData,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(401);
      expect(response.body).to.contain('Missing authorization header');
    });
  });
  

describe('API tests', () => {
  it('5. Create post with adding access token in header. Verify HTTP response status code. Verify post is created.', () => {
    const email = faker.internet.email(); // Генерируем уникальную электронную почту
    const password = faker.internet.password();

    cy.request({
      method: 'POST',
      url: '/register',
      body: {
        email: email,
        password: password
      }
    }).then(response => {
      expect(response.status).to.equal(201);
      const accessToken = response.body.accessToken;

      const postData = {
        title: "New post with access token",
        body: "Body of the new post"
      };

      cy.request({
        method: 'POST',
        url: '/664/posts',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: postData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(201); 
      });
    });
  });
});
 

    it('6. Create post entity and verify that the entity is created. Verify HTTP response status code. Use JSON in body.', () => {
      const postData = {
         title: 'New post for task 6',
         body: 'New post created for task 6'
      };
     
      cy.request({
         method: 'POST',
         url: '/posts',
         body: postData,
         headers: {
            'Content-Type': 'application/json'
         }
      }).then(response => {
         expect(response.status).to.be.equal(201);
         expect(response.body.title).to.equal(postData.title);
         expect(response.body.body).to.equal(postData.body);
      });
   });


    it('7. Update non-existing entity. Verify HTTP response status code.', () => {
      const updatepostData = {
         title: 'update title',
         body: 'update body'
      };
   

      cy.request({
         method: 'PUT',
         url: '/posts/123', 
         body: updatepostData,
         failOnStatusCode: false
      }).then(response => {
         expect(response.status).to.be.equal(404);
      });
   });


  it('8. Create post entity and update the created entity. Verify HTTP response status code and verify that the entity is updated.', () => {
    const postData = {
      title: 'New post for task 8',
      body: 'New post created for task 8'
    };
  
    
    cy.request({
      method: 'POST',
      url: '/posts',
      body: postData
    }).then(createResponse => {
      expect(createResponse.status).to.be.equal(201);
    
      const postId = createResponse.body.id;
  
      
      const updatedData = {
        title: 'Updated post title',
        body: 'Updated post body'
      };
  
      
      cy.request({
        method: 'PUT',
        url: `/posts/${postId}`, 
        body: updatedData
      }).then(updateResponse => {
        expect(updateResponse.status).to.be.equal(200);
        expect(updateResponse.body.title).to.equal(updatedData.title);
        expect(updateResponse.body.body).to.equal(updatedData.body);
      });
    });
  });


    it('9. Delete non-existing post entity. Verify HTTP response status code.', () => {
      const id = [];
      cy.request({ method: 'DELETE', url: `/posts/${postId}`, failOnStatusCode: false }).then(response => {
        expect(response.status).to.be.equal(404);
      });
    });


    it('10. Create post entity, update the created entity, and delete the entity. Verify HTTP response status code and verify that the entity is deleted.', () => {
      cy.log('Create post entity');
    
      const postData = {
        title: 'New post for task 10',
        body: 'New post created for task 10'
      };
    
      cy.request({ method: 'POST', url: '/posts', body: postData }).then(createResponse => {
        expect(createResponse.status).to.be.equal(201);
        const postId = createResponse.body.id;
    
        const updatedData = {
          title: 'Updated post title',
          body: 'Updated post body'
        };
    
        cy.request({ method: 'PUT', url: `/posts/${postId}`, body: updatedData }).then(updateResponse => {
          expect(updateResponse.status).to.be.equal(200);
    
          cy.request({ method: 'DELETE', url: `/posts/${postId}` }).then(deleteResponse => {
            expect(deleteResponse.status).to.be.equal(200);
          });
        });
      });
    });
  });