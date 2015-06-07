/**
 * This file provided by Facebook is for non-commercial testing and evaluation purposes only.
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var CommentBox = React.createClass({
  //This executes only once at the beginning to set the initial state
  loadCommentsFromServer : function(){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data){
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  //It is here right here:
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      //How does it know that the date is stored in comment?
      data: comment,
      success: function(data){
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState : function() {
    return {data: []};
  },

  componentDidMount: function(){
    this.loadCommentsFromServer();      
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },

  render : function(){
    return(
      <div className='commentBox'>
        <h1> Comments </h1>
        <CommentList data={this.state.data} />
        //The handler is passed to the child as props
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
}); 

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author){
      return;
    }
    //here we have to to use props because the handler is coming
    //from the parent passed in as a property (CommentBox)
    this.props.onCommentSubmit({author: author, text: text});

    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  },
  render : function(){
    return(
      //Here we can use this.handleSubmit because we define
      //the component handler inside the component
      <form className='commentForm' onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something" ref="text" />
        <input type="submit" placeholder="Post" />
      </form>
    );
  }
});

var CommentList = React.createClass({
  render : function() {
    var commentNodes = this.props.data.map(function(comment) {
      return(
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
      );
    });
    return(
      <div className='commentList'>
        {commentNodes}
      </div>
    );
  }
});

var Comment = React.createClass({
  render : function(){
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return(
      <div className='comment'>
        <h2 className='commentAuthor'>
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    ); 
  }
});

React.render(
  <CommentBox url="comments.json" pollInterval={1000}/>,
  document.getElementById('content')
);
//Notes:
//.props is basically how a child sets the info set by its parent
// they are consider immutable and do not affect the rendering
//.state has to do with the state of an specific attribute of the component
//handlers are used to literally handle events and can be defined
//internally or passed as props to the children