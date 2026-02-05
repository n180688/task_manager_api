const TASK_STATUSES = ['in_progress', 'done'];


function validateTaskCreate(req, res, next){
    const { title, content, deadline, categoryId } = req.body;

    if(typeof title !== 'string' ){
        return res.status(400).json({ message: 'Title is required' });
    }

    let trimmedTitle = title.trim();

    if(!trimmedTitle){
        return res.status(400).json({ message: 'Title cannot be empty' });
    }

    let normalizedContent = null;

    if(content !== undefined) {
        if(typeof content !== 'string'){
            return res.status(400).json({ message: 'Content must be a string' });
        }

        normalizedContent = content.trim() || null;
    }

    let normalizedDeadline = null;

    if(deadline){
        const date = new Date(deadline);

        if(Number.isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Invalid deadline format' });
    }

    normalizedDeadline = date;
    }

    if(categoryId === undefined) {
      return res.status(400).json({ message: 'Category required' })
    }
    if(Number.isNaN(categoryId)){
      return res.status(400).json({ message: 'Invalid categoryId' })
    }

    req.body = { 
            title: trimmedTitle,
            content: normalizedContent,
            deadline: normalizedDeadline,
            categoryId: Number(categoryId)
        };

    next();
}


function validateTaskPatch(req, res, next) {
  const { title, content, deadline, status, categoryId } = req.body;
  const normalized = {};

  // title
  if (title !== undefined) {
    if (typeof title !== 'string') {
      return res.status(400).json({ message: 'Title must be a string' });
    }

    const trimmed = title.trim();
    if (!trimmed) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }

    normalized.title = trimmed;
  }

  // content
  if (content !== undefined) {
    if (content === null) {
      normalized.content = null;
    } else {
      if (typeof content !== 'string') {
        return res.status(400).json({ message: 'Content must be a string' });
      }

      const trimmed = content.trim();
      normalized.content = trimmed || null;
    }
  }

  // deadline
  if (deadline !== undefined) {
    if (deadline === null || deadline === '') {
      normalized.deadline = null;
    } else {
      const date = new Date(deadline);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Invalid deadline format' });
      }

      normalized.deadline = date;
    }
  }

  // status
  if (status !== undefined) {
    if (!TASK_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    normalized.status = status;
  }

  //categoryId
  if(categoryId !== undefined){
    if(Number.isNaN(categoryId)){
      return res.status(400).json({ message: 'Invalid categoryId' })
    }
    normalized.categoryId = categoryId;
  }

  

  if (Object.keys(normalized).length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  req.validatedData = normalized;
  next();
}



export {validateTaskCreate, validateTaskPatch}