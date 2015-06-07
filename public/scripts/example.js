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
  render : function(){
    return(
      <div className='commentBox'>
        <h1> Comments </h1>
        <CommentList data = {this.props.data} />
        <CommentForm />
      </div>
    );
  }
}); 

var CommentForm = React.createClass({
  render : function(){
    return(
      <div className='commentForm'>
        Hey this is a comment form yei
      </div>
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
  <CommentBox url="comment.json" />,
  document.getElementById('content')
);
